<template>
  <div class="app-container">

    <el-row>
    <account-cash-table :type="2" :records="accountCashs" :loading="loading" @action="onAction"></account-cash-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import AccountCashTable from "./widget/AccountCashTable";
import merchantAccountService from "@/api/merchant-account-service.js";

export default {
  components: {
    AccountCashTable
  },
  data() {
    return {
      loading: true,
      accountCashs: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
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
        $offset: that.offset
      };

      merchantAccountService
        .listAccountCash(params)
        .then(response => {
          that.accountCashs = response.data.list;
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
