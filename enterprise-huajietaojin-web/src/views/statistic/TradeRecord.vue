<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify"></init-alert>
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
import { mapGetters } from "vuex";
import InitAlert from "@/components/InitAlert";

export default {
  components: {
    RecordTable,
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
      records: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      stores: [],
      storeId: null
    };
  },
  methods: {
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
      if (!this.firm || !this.firm.id) {
        this.loading = false;
        return;
      }

      const that = this;
      let firmId = that.firm.id;

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
      // console.log(`当前页: ${page}`);
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
        if (i++ > 6) {
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
