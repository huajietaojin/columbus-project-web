<template>
  <div class="app-container">

    <el-row :gutter="12" >
      <el-col :span="4">
        <el-input v-model="firmId" placeholder="企业ID"></el-input>
      </el-col>
      <el-col :span="4">
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
    <record-table :records="records" :loading="loading" @action="onAction"></record-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import RecordTable from "./components/RecordTable";
import recordService from "@/api/trade-record-service.js";
import storeService from "@/api/store-service.js";

export default {
  components: {
    RecordTable
  },
  data() {
    return {
      loading: true,
      records: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      stores: [],
      storeId: null,
      firmId:null,
      storePulling: false
    };
  },
  methods: {
    onFocus(e) {
      if (!this.firmId) {
        this.$notify.warning("请先选择企业");
        return;
      }
      this.listStores();
    },
    onAction(key) {
      const arr = key.split("-");
      const type = arr[0];
      // if (type === "update") {
      //   this.$router.push({ name: "StoreUpdate", params: { id: arr[1] } });
      //   return;
      // } else if (type === "detail") {
      //   this.$router.push({ name: "StoreDetail", params: { id: arr[1] } });
      // } else {
      //   return;
      // }
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

      recordService
        .list(params)
        .then(response => {
          that.records = response.data.list;
          if (that.count) {
            that.total = response.data.total;
          }
          that.loading = false;
        })
        .catch(err => {
          console.log("list err", err);
          that.loading = false;
          that.$message.error(err);
        });
    },
    listStores() {
      if (!this.firmId) {
        return;
      }

      const that = this;
      that.storePulling = true;
      const params = {
        $limit: 1000,
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
          that.$message.error(err)
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
      this.fetchData();
    },
    onReset: function() {
      this.firmId = null;
      this.storeId = null;
      this.page = 1;
      this.total = 0;
      this.stores = [];
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
