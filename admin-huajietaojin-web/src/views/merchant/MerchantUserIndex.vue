<template>
  <div class="app-container">

    <el-row :gutter="12" >
        <el-col :span="6">
          <el-input v-model="unid" placeholder="商家UNID"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="mobile" placeholder="手机号"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button plain type="primary" @click="onSearch">查询</el-button>
          <el-button plain type="info" @click="onReset">重置</el-button>
        </el-col>
    </el-row>


    <el-row>
    <merchant-user-table :type="2" :records="merchantUsers" :loading="loading" @action="onAction"></merchant-user-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import MerchantUserTable from "./widget/MerchantUserTable";
import merchantUserService from "@/api/merchant-user-service.js";

export default {
  components: {
    MerchantUserTable
  },
  data() {
    return {
      loading: true,
      merchantUsers: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      unid: null,
      mobile: null,
    };
  },
  methods: {
    onAction(key) {
      console.log("onAction", key);
    },
    fetchData() {

      const that = this;
      that.offset = (that.page - 1) * that.limit;
      that.count = that.total < 1;
      const params = {
        $count: that.count,
        $limit: that.limit,
        $offset: that.offset,
        unid: that.unid,
        mobile: that.mobile
      };

      merchantUserService
        .list(params)
        .then(response => {
          that.merchantUsers = response.data.list;
          if (that.count) {
            that.total = response.data.total;
          }
          that.loading = false;
        })
        .catch(err => {
          console.log("list err", err);
          that.$message.error(err);
          that.loading = false;
        });
    },
    onSearch: function() {
      this.total = 0;
      this.fetchData();
    },
    onReset: function() {
      this.unid = null;
      this.mobile = null;
      this.page = 1;
      this.total = 0;
      this.fetchData();
    },
    handleCurrentChange: function(page) {
      // console.log(`当前页: ${page}`);
      this.page = page;
      this.fetchData();
    },
    delayFetchData() {
      this.fetchData();
    }
  },
  created() {
    this.delayFetchData();
  }
};
</script>
