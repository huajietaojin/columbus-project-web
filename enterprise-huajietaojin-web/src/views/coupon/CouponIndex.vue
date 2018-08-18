<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify" color="error"></init-alert>
    </el-row>

    <el-row :gutter="12">
      <el-col :span="6" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-select v-model="storeId" filterable clearable placeholder="选择门店" style="width: 100%;">
          <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6" :xs="16" :sm="16" :md="8" :lg="6" :xl="6">
        <el-button plain type="primary" @click="onSearch">查询</el-button>
        <el-button plain type="info" @click="onReset">重置</el-button>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-between">
       <el-col :span="12" :xs="22" :sm="20" :md="18" :lg="12" :xl="12">
         <el-button type="primary"  @click="onCreateRecord">添加现金券</el-button>
        <el-button type="success" :loading="doing" :disabled="doing" @click="onBatchEnablTrue">批量发行</el-button>
        <el-button type="warning" :loading="doing" :disabled="doing" @click="onBatchEnablFalse">批量下线</el-button>
       </el-col>
       <el-col :span="1">
          <el-popover
            placement="top-start"
            title="提示"
            width="300"
            trigger="hover"
            >
            <el-row>
              <span>卡券处于发行状态时，才能被用户浏览</span>
            </el-row>
            <el-row>
              <span>一个门店可以有任意个卡券，但只能同时发行有限个卡券</span>
            </el-row>
            <el-button slot="reference"><i class="el-icon-question"></i></el-button>
          </el-popover>
       </el-col>
    </el-row>
    
    <el-row>
    <coupon-table :coupons="coupons" :loading="loading" @action="onAction" @selection-change="onSelecttionChange"></coupon-table>
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
        <span>{{storeName}}的现金券二维码，右击另存到本地</span>
        <img :src="qrcodeUrl" width="360rpx" height="360rpx" v-if="!imageLoading" />
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import CouponTable from "./widget/CouponTable";
import couponService from "@/api/coupon-service.js";
import storeService from "@/api/store-service.js";
import qrcodeService from "@/api/qrcode-image-service.js";
import { mapGetters } from "vuex";
import { getUnid } from "@/utils/auth";
import InitAlert from "@/components/InitAlert"

export default {
  components: {
    CouponTable,InitAlert
  },
  computed: {
    ...mapGetters(["firm"]),
    notify: function() {
      return !this.firm || !this.firm.id;
    }
  },
  data() {
    return {
      loading: true,
      coupons: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      storeId: null,
      stores: [],
      selection: [],
      doing: false,
      dialogVisible: false,
      storeName: "",
      qrcodeUrl: "",
      imageLoading: false
    };
  },
  methods: {
    onCreateRecord() {
      this.$router.push({ name: "CouponCreate" });
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
          couponService
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
        this.$router.push({ name: "CouponUpdate", params: { id: arr[1] } });
        return;
      } else if (type === "detail") {
        this.$router.push({ name: "CouponDetail", params: { id: arr[1] } });
      } else if (type === "preview") {
        this.dialogVisible = true;
        this.imageLoading = true;
        let couponId = arr[1];
        let param = {
          coupon_id: couponId,
          user_unid: getUnid(),
          logo_url: ""
        };
        for (let v of this.coupons) {
          if (v.id == couponId) {
            param.logo_url = v.picture;
            this.storeName = v.store_name;
            break;
          }
        }
        let that = this;
        qrcodeService
          .createCouponPreview(param)
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
      // console.log("select list", list);
      this.selection = list;
    },
    onBatchEnablTrue() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要发行的卡券");
        return;
      }
      this.submitBatchEnabl(true);
    },
    onBatchEnablFalse() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要下线的卡券");
        return;
      }
      this.submitBatchEnabl(false);
    },
    submitBatchEnabl(trueOrFalse) {
      if (!this.selection || this.selection.length < 1) {
        return;
      }
      if (!this.firm || !this.firm.id) {
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
        firm_id: this.firm.id,
        enable: trueOrFalse,
        id_list: idList
      };
      let that = this;
      couponService
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
      if (!this.firm || !this.firm.id) {
        this.loading = false;
        return;
      }

      let firmId = this.firm.id;
      const that = this;

      that.offset = (that.page - 1) * that.limit;
      that.count = that.total < 1;
      const params = {
        $count: that.count,
        $limit: that.limit,
        $offset: that.offset,
        firm_id: firmId
      };

      if (this.storeId) {
        params.store_id = this.storeId;
      }

      couponService
        .list(params)
        .then(response => {
          // console.log(response.data);
          that.coupons = response.data.list;
          if (that.count) {
            that.total = response.data.total;
          }
          that.loading = false;
        })
        .catch(err => {
          that.$message.error(err);
          that.loading = false;
        });
    },
    listStores() {
      if (!this.firm || !this.firm.id) {
        return;
      }

      let firmId = this.firm.id;
      const that = this;
      const params = {
        $limit: 50,
        $offset: 0,
        firm_id: firmId
      };

      storeService
        .list(params)
        .then(response => {
          that.stores = response.data.list;
        })
        .catch(err => {
          console.log("list err", err);
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
      this.page = 1;
      this.total = 0;
      this.fetchData();
    },
    delayFetchData() {
      const that = this;
      that.loading = true;
      if (that.firm && that.firm.id) {
        that.fetchData();
        that.listStores();
        return;
      }
      let i = 0;
      let handler = setInterval(function() {
        if (i++ > 2) {
          that.loading = false;
          clearInterval(handler);
        }
        console.log("delayFetchData");
        if (!that.firm || !that.firm.id) {
          return;
        }
        that.fetchData();
        that.listStores();
        clearInterval(handler);
      }, 500);
    }
  },
  created() {
    this.delayFetchData();
  }
};
</script>
