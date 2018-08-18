<template>
  <div class="app-container">
   
    <el-row :gutter="12" >
      <el-col :span="6">
        <el-input v-model="firmId" placeholder="企业ID"></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="storeId" @focus="onFocus" :loading="storePulling" filterable clearable placeholder="选择门店" style="width: 100%;">
          <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button plain type="primary" @click="onSearch">查询</el-button>
        <el-button plain type="info" @click="onReset">重置</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-button type="primary" :loading="doing" :disabled="doing" @click="onBatchConfirm">视频审核</el-button>
      <el-button type="success" :loading="doing" :disabled="doing" @click="onBatchEnablTrue">批量上架</el-button>
      <el-button type="warning" :loading="doing" :disabled="doing" @click="onBatchEnablFalse">批量下架</el-button>
    </el-row>
    
    <el-row>
    <store-video-table :store-videos="storeVideos" :loading="loading" @action="onAction" @selection-change="onSelecttionChange"></store-video-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>

    <el-dialog
      title="设置权重"
      :visible.sync="weightDiaolog"
      width="420px">
      <el-row>
        <span>正在修改：{{weightRecord.name}}，权重越大排名越前。</span>
      </el-row>
      <el-row>
        <el-input-number v-model.number="weightRecord.weight" :step="500" :min="1" :max="10000000" controls-position="right" style="width:90%;"></el-input-number>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="weightDiaolog = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateWeight">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="审核视频"
      :visible.sync="confirmDiaolog"
      width="420px">
      <el-row>
        <el-alert
            title="请选择审核处理意见结果"
            type="warning"
            show-icon>
          </el-alert>
      </el-row>
      <el-row>
        <el-select v-model="confirmResult" placeholder="请选择">
          <el-option
            v-for="item in confirmOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-row>
        <el-input placeholder="通过或不通过理由" v-model="confirmReason" auto-complete="off"></el-input>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDiaolog = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import StoreVideoTable from "./widget/StoreVideoTable";
import storeVideoService from "@/api/store-video-service.js";
import storeService from "@/api/store-service.js";

export default {
  components: {
    StoreVideoTable
  },
  data() {
    return {
      loading: true,
      storeVideos: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      stores: [],
      storeId: null,
      selection: [],
      doing: false,
      firmId: null,
      storePulling: false,

      weightDiaolog: false,
      weightRecord: {
        name: "",
        weight: 1000
      },

      videoConfirmList: [],
      confirmDiaolog: false,
      confirmResult: 2,
      confirmOptions: [
        {
          value: 2,
          label: "审核不通过"
        },
        {
          value: 99,
          label: "审核通过"
        }
      ],
      confirmReason: ""
    };
  },
  methods: {
    onUpdateWeight() {
      let param = {
        weight: this.weightRecord.weight
      };
      const that = this;
      storeVideoService
        .updateProfileWeight(this.weightRecord.id, param)
        .then(res => {
          that.fetchData();
          that.weightDiaolog = false;
          that.$message.success("修改成功");
        })
        .catch(err => {
          that.$message.error(err);
          that.weightDiaolog = false;
        });
    },
    onFocus(e) {
      if (!this.firmId) {
        this.$notify.warning("请先选择企业");
        return;
      }
      this.listStores();
    },
    confirmDelete(arr) {
      let tip = "此操作将永久删除【" + arr[2] + "】, 是否继续?";
      let that = this;
      that
        .$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          storeVideoService
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
      // console.log('handleCommand:' + key)
      const arr = key.split("-");
      const type = arr[0];
      if (type === "remove") {
        this.confirmDelete(arr);
        return;
      } else if (type === "update") {
        this.$router.push({ name: "StoreVideoUpdate", params: { id: arr[1] } });
        return;
      } else if (type === "weight") {
        let id = arr[1];
        for (let m of this.storeVideos) {
          if (id == m.id) {
            this.weightRecord = m;
            this.weightDiaolog = true;
            return;
          }
        }
        this.weightDiaolog = false;
        return;
      } else if (type === "detail") {
        this.$router.push({ name: "StoreVideoDetail", params: { id: arr[1] } });
      } else {
        return;
      }
    },
    onSelecttionChange(list) {
      this.selection = list;
    },
    onSubmitConfirm() {
      this.doing = true;
      let param = {
        id_list: this.videoConfirmList,
        confirm_result: this.confirmResult,
        confirm_reason: this.confirmReason
      };
      const that = this;
      storeVideoService
        .batchConfirm(param)
        .then(res => {
          that.$message.success("修改成功");
          that.fetchData();
          that.doing = false;
          that.confirmDiaolog = false;
        })
        .catch(err => {
          that.$message.error(err);
          that.doing = false;
          that.confirmDiaolog = false;
        });
    },
    onBatchConfirm() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要审核的视频");
        return;
      }

      this.videoConfirmList = [];
      for (let item of this.selection) {
        // if (trueOrFalse === item.enable) {
        //   continue;
        // }
        this.videoConfirmList.push(item.id);
      }
      if (this.videoConfirmList.length < 1) {
        this.$notify.warning("无效选择信息");
        this.doing = false;
        return;
      }
      this.confirmDiaolog = true;
    },
    onBatchEnablTrue() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要上架的视频");
        return;
      }
      this.submitBatchEnabl(true);
    },
    onBatchEnablFalse(trueOrFalse) {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要下架的视频");
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
        firm_id: this.firmId,
        enable: trueOrFalse,
        id_list: idList
      };
      let that = this;
      storeVideoService
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
    fetchData() {
      const that = this;
      that.offset = (that.page - 1) * that.limit;
      that.count = that.total < 1;
      const params = {
        $count: that.count,
        $limit: that.limit,
        $offset: that.offset,
        firm_id: that.firmId
      };

      if (this.storeId) {
        params.store_id = this.storeId;
      }

      storeVideoService
        .list(params)
        .then(response => {
          // console.log(response.data);
          that.storeVideos = response.data.list;
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
    listStores() {
      if (!this.firmId) {
        return;
      }

      const that = this;
      that.storePulling = true;
      const params = {
        $limit: 10000,
        $offset: 0,
        firm_id: that.firmId
      };

      storeService
        .list(params)
        .then(response => {
          that.stores = response.data.list;
          that.storePulling = false;
        })
        .catch(err => {
          that.storePulling = false;
          that.$message.error(err);
        });
    },
    handleCurrentChange: function(page) {
      // console.log(`当前页: ${page}`)
      this.page = page;
      this.fetchData();
    },
    onSearch: function() {
      this.total = 0;
      this.fetchData();
    },
    onReset: function() {
      this.storeId = null;
      this.firmId = null;
      this.page = 1;
      this.total = 0;
      this.fetchData();
    },
    delayFetchData() {
      this.fetchData();
      this.listStores();
    }
  },
  created() {
    this.delayFetchData();
  }
};
</script>
