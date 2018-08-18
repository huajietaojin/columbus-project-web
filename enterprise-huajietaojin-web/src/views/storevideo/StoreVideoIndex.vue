<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify" color="error"></init-alert>
    </el-row>
   
    <el-row :gutter="12" >
      <el-col :span="6" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-select v-model="storeId" filterable clearable placeholder="选择门店" style="width: 100%;">
          <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6" :xs="14" :sm="14" :md="8" :lg="6" :xl="6">
        <el-button plain type="primary" @click="onSearch">查询</el-button>
        <el-button plain type="info" @click="onReset">重置</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-button type="primary"  @click="onCreateRecord">添加视频</el-button>
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
  </div>
</template>

<script>
import StoreVideoTable from "./widget/StoreVideoTable";
import storeVideoService from "@/api/store-video-service.js";
import storeService from "@/api/store-service.js";
import { mapGetters } from "vuex";
import InitAlert from "@/components/InitAlert";

export default {
  components: {
    StoreVideoTable,
    InitAlert
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
      storeVideos: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      stores: [],
      storeId: null,
      selection: [],
      doing: false
    };
  },
  methods: {
    onCreateRecord() {
      this.$router.push({ name: "StoreVideoCreate" });
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
      } else if (type === "detail") {
        this.$router.push({ name: "StoreVideoDetail", params: { id: arr[1] } });
      } else {
        return;
      }
    },
    onSelecttionChange(list) {
      this.selection = list;
    },
    onBatchEnablTrue() {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要上架的商品");
        return;
      }
      this.submitBatchEnabl(true);
    },
    onBatchEnablFalse(trueOrFalse) {
      if (!this.selection || this.selection.length < 1) {
        this.$notify.warning("请选择需要下架的商品");
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
