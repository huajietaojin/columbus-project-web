<template>
  <div class="app-container">
      <el-row :gutter="12" >
        <el-col :span="6">
          <el-input v-model="firmId" placeholder="企业ID"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button plain type="primary" @click="onSearch">查询</el-button>
          <el-button plain type="info" @click="onReset">重置</el-button>
        </el-col>
      </el-row>

     <el-row type="flex" justify="space-between">
       <el-col :span="12">
        <el-button type="success" :loading="doing" :disabled="doing" @click="onBatchEnablTrue">启用门店</el-button>
        <el-button type="warning" :loading="doing" :disabled="doing" @click="onBatchEnablFalse">禁用门店</el-button>
       </el-col>
       <el-col :span="1">
          <el-popover
            placement="top-start"
            title="提示"
            width="320"
            trigger="hover"
            >
            <el-row>
              <span>下拉菜单 `小程序预览` 可以查看门店实际效果，小程序可以直接分享到微信群</span>
            </el-row>
            <el-row>
              <span>门店处于启用状态时，现金券和商品才能被用户浏览</span>
            </el-row>
            <el-row>
              <span>一个企业账户可以添加任意个门店，但只能同时有固定数目个门店处于启用状态</span>
            </el-row>
            <el-row>
              <span>每个门店可以添加任意个卡券，但只有固定数目的卡券能同时处于发行状态</span>
            </el-row>
            <el-button slot="reference"><i class="el-icon-question"></i></el-button>
          </el-popover>
       </el-col>
    </el-row>

    <el-row>
    <store-table :stores="stores" :loading="loading" @action="onAction" @selection-change="onSelecttionChange"></store-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>

    <el-dialog
      title="请用微信扫描下面二维码"
      :visible.sync="dialogVisible"
      width="400px">
      <el-row v-loading="imageLoading">
        <span>门店：{{storeName}}，右击另存到本地</span>
        <img :src="qrcodeUrl" width="360rpx" height="360rpx" v-if="!imageLoading" />
      </el-row>
    </el-dialog>

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

  </div>
</template>

<script>
import StoreTable from "./widget/StoreTable";
import storeService from "@/api/store-service.js";
import qrcodeService from "@/api/qrcode-image-service.js";
import { getUnid } from "@/utils/auth";

export default {
  components: {
    StoreTable
  },
  data() {
    return {
      firmId: null,
      loading: true,
      stores: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      selection: [],
      doing: false,
      dialogVisible: false,
      storeName: "",
      qrcodeUrl: "",
      imageLoading: false,

      weightDiaolog: false,
      weightRecord: {
        name: "",
        weight: 1000
      }
    };
  },
  methods: {
    onUpdateWeight() {
      let param = {
        weight: this.weightRecord.weight
      };
      const that = this;
      storeService
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
    confirmDelete(arr) {
      let tip =
        "此操作将永久删除【" +
        arr[2] +
        "】, 同时删除门店下的所有现金券及商品信息, 请仔细确认?";
      let that = this;
      that
        .$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          storeService
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
    onDownload() {
      window.location.href = this.qrcodeUrl;
    },
    onAction(key) {
      const arr = key.split("-");
      const type = arr[0];
      if (type === "remove") {
        this.confirmDelete(arr);
        return;
      } else if (type === "update") {
        this.$router.push({ name: "StoreUpdate", params: { id: arr[1] } });
        return;
      } else if (type === "weight") {
        let id = arr[1];
        for (let m of this.stores) {
          if (id == m.id) {
            this.weightRecord = m;
            this.weightDiaolog = true;
            return;
          }
        }
        this.weightDiaolog = false;
        return;
      } else if (type === "detail") {
        this.$router.push({ name: "StoreDetail", params: { id: arr[1] } });
      } else if (type === "preview") {
        this.dialogVisible = true;
        this.imageLoading = true;
        let storeId = arr[1];
        let param = {
          store_id: storeId,
          user_unid: getUnid(),
          logo_url: ""
        };
        for (let v of this.stores) {
          if (v.id == storeId) {
            param.logo_url = v.logo;
            this.storeName = v.name;
            break;
          }
        }
        let that = this;
        qrcodeService
          .createStorePreview(param)
          .then(res => {
            that.qrcodeUrl = res.data.url;
            that.imageLoading = false;
          })
          .catch(err => {
            that.$message.error(err);
            that.imageLoading = false;
          });
      } else {
        return;
      }
    },
    onSelecttionChange(list) {
      this.selection = list;
    },
    onBatchEnablTrue() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要启用的门店");
        return;
      }
      this.submitBatchEnabl(true);
    },
    onBatchEnablFalse(trueOrFalse) {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要禁用的门店");
        return;
      }
      this.submitBatchEnabl(false);
    },
    submitBatchEnabl(trueOrFalse) {
      if (!this.selection || this.selection.length < 1) {
        return;
      }
      if (!this.firmId) {
        this.$notify.warning("请先输入企业ID进行过滤");
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
      storeService
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

      storeService
        .list(params)
        .then(response => {
          that.stores = response.data.list;
          if (that.count) {
            that.total = response.data.total;
          }
          that.loading = false;
        })
        .catch(err => {
          // console.log("list err", err);
          that.$message.error(err);
          that.loading = false;
        });
    },
    handleCurrentChange: function(page) {
      // console.log(`当前页: ${page}`);
      this.page = page;
      this.fetchData();
    },
    onSearch: function() {
      if (!this.firmId) {
        this.$notify.warning("请先选择企业");
        return;
      }
      this.total = 0;
      this.delayFetchData();
    },
    onReset: function() {
      this.firmId = null;
      this.page = 1;
      this.total = 0;
      this.delayFetchData();
    },
    delayFetchData() {
      this.fetchData();
    }
  },
  created() {
    // console.log("StoreIndex", this.firm);
    this.delayFetchData();
  }
};
</script>
