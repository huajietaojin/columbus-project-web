<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="4">
        <el-select v-model="provinceNo" filterable clearable placeholder="筛选省份" style="width: 100%;" >
          <el-option v-for="item in provinces" :key="item.n" :label="item.m" :value="item.n">
              <span style="float: left">{{ item.m }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.n }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="cityNo" :loading="cityPulling" filterable clearable placeholder="筛选城市" style="width: 100%;" >
          <el-option v-for="item in citys" :key="item.city_no" :label="item.city_name" :value="item.city_no">
              <span style="float: left">{{ item.city_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.city_no }}</span>
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="3">
        <el-select v-model="confirmOrNot" clearable placeholder="是否认证">
          <el-option :key="true" label="已认证" :value="true">
              <span style="float: left">已认证</span>
          </el-option>
          <el-option :key="false" label="未认证" :value="false">
              <span style="float: left">未认证</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="enableOrNot" clearable placeholder="是否启用">
          <el-option :key="true" label="启用" :value="true">
              <span style="float: left">启用</span>
          </el-option>
          <el-option :key="false" label="禁用" :value="false">
              <span style="float: left">禁用</span>
          </el-option>
        </el-select>
      </el-col>
      
      <el-col :span="6">
        <el-button plain type="primary" @click="onSearch">查询</el-button>
        <el-button plain type="info" @click="onReset">重置</el-button>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-between">
       <el-col :span="20">
        <el-button type="success" :loading="doing" :disabled="doing" @click="onBatchConfirmTrue">批量认证</el-button>
        <el-button type="warning" :loading="doing" :disabled="doing" @click="onBatchConfirmFalse">取消认证</el-button>
        <el-button type="success" :loading="doing" :disabled="doing" @click="onBatchEnablTrue">批量启用</el-button>
        <el-button type="warning" :loading="doing" :disabled="doing" @click="onBatchEnablFalse">批量禁用</el-button>
       </el-col>
       <el-col :span="1">
          <el-popover
            placement="top-start"
            title="提示"
            width="320"
            trigger="hover"
            >
            <el-row>
              <span>谨慎操作</span>
            </el-row>
            <el-button slot="reference"><i class="el-icon-question"></i></el-button>
          </el-popover>
       </el-col>
    </el-row>

    <el-row>
      <firm-table :firms="firms" :loading="loading" @action="onAction" @selection-change="onSelecttionChange"></firm-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import FirmTable from "./widget/FirmTable";
import firmService from "@/api/firm-service.js";
import chinaService from "@/api/china-service";

export default {
  components: {
    FirmTable
  },
  data() {
    return {
      loading: true,
      firms: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      provinces: chinaService.provinces,
      citys: [],
      cityPulling: false,
      provinceNo: null,
      cityNo: null,
      doing: false,
      selection: [],
      confirmOrNot: null,
      enableOrNot: null
    };
  },
  watch: {
    provinceNo: function(pno, old) {
      if (!pno || pno === "") {
        this.citys = [];
        this.cityNo = null;
        return;
      }
      let that = this;
      that.cityPulling = true;
      chinaService
        .listCitys(pno)
        .then(res => {
          that.citys = res.data.list;
          that.cityPulling = false;
        })
        .catch(err => {
          that.$message.error(err);
          that.cityPulling = false;
        });
      return;
    }
  },
  methods: {
    confirmDelete(arr) {
      let tip =
        "此操作将永久删除【" + arr[2] + "】, 同时删除企业所有信息, 请仔细确认?";
      let that = this;
      that
        .$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          firmService
            .remove(arr[1])
            .then(res => {
              that.$message.success("删除成功");
              that.fetchData();
            })
            .catch(err => {
              that.$message.error("删除失败");
            });
        })
        .catch(() => {
          console.log("cancel remove");
        });
    },
    onAction(key) {
      const arr = key.split("-");
      const type = arr[0];
      const that = this;
      if (type === "remove") {
        this.confirmDelete(arr);
        return;
      } else if (type === "update") {
        this.$router.push({ name: "FirmUpdate", params: { id: arr[1] } });
        return;
      } else if (type === "detail") {
        this.$router.push({ name: "FirmDetail", params: { id: arr[1] } });
      } else {
        return;
      }
    },
    fetchData() {
      const that = this;
      that.offset = (that.page - 1) * that.limit;
      that.count = that.total < 1;

      const params = {
        $count: that.count,
        $limit: that.limit,
        $offset: that.offset
      };
      if (that.provinceNo) {
        params.province_no = that.provinceNo;
      }
      if (that.cityNo) {
        params.city_no = that.cityNo;
      }

      if (that.confirmOrNot != null) {
        params.confirm = that.confirmOrNot
      }
      if (that.enableOrNot != null) {
        params.enable = that.enableOrNot
      }

      firmService
        .list(params)
        .then(response => {
          that.firms = response.data.list;
          if (that.count) {
            that.total = response.data.total;
          }
          that.loading = false;
        })
        .catch(err => {
          console.log("list err", err);
          that.loading = false;
        });
    },
    handleCurrentChange: function(page) {
      this.page = page;
      this.fetchData();
    },
    onSearch: function() {
      this.total = 0;
      this.fetchData();
    },
    onReset: function() {
      this.provinceNo = null;
      this.cityNo = null;
      this.page = 1;
      this.total = 0;
      this.confirmOrNot = null;
      this.enableOrNot = null;
      this.fetchData();
    },
    onSelecttionChange(list) {
      this.selection = list;
    },
    onBatchEnablTrue() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要启用的企业");
        return;
      }
      this.submitBatchEnabl(true);
    },
    onBatchEnablFalse(trueOrFalse) {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要禁用的企业");
        return;
      }
      this.submitBatchEnabl(false);
    },
    submitBatchEnabl(trueOrFalse) {
      if (!this.selection || this.selection.length < 1) {
        return;
      }
      this.doing = true;
      let idList = [];
      for (let item of this.selection) {
        if (trueOrFalse === item.enable) {
          continue;
        }
        idList.push(item.id);
      }
      if (idList.length < 1) {
        this.$notify.warning("无效选择信息");
        this.doing = false;
        return;
      }
      let param = {
        enable: trueOrFalse,
        id_list: idList
      };
      let that = this;
      firmService
        .batchEable(param)
        .then(res => {
          that.$message.success("修改成功");
          that.fetchData();
          that.doing = false;
        })
        .catch(err => {
          that.$message.error(err);
          that.doing = false;
        });
    },

    onBatchConfirmTrue() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要认证的企业");
        return;
      }
      this.submitBatchConfirm(true);
    },
    onBatchConfirmFalse() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要认证的企业");
        return;
      }
      this.submitBatchConfirm(false);
    },
    submitBatchConfirm(trueOrFalse) {
      if (!this.selection || this.selection.length < 1) {
        return;
      }
      this.doing = true;
      let idList = [];
      for (let item of this.selection) {
        if (trueOrFalse === item.confirm) {
          continue;
        }
        idList.push(item.id);
      }
      if (idList.length < 1) {
        this.$notify.warning("无效选择信息");
        this.doing = false;
        return;
      }
      let param = {
        enable: trueOrFalse,
        id_list: idList
      };
      let that = this;
      firmService
        .batchConfirm(param)
        .then(res => {
          that.$message.success("修改成功");
          that.fetchData();
          that.doing = false;
        })
        .catch(err => {
          that.$message.error(err);
          that.doing = false;
        });
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
