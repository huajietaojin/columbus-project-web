<template>
  <div class="app-container">

    <el-row>
    <visitor-table :type="3" :visitors="visitors" :loading="loading" @action="onAction"></visitor-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import VisitorTable from "./components/VisitorTable";
import visitorService from "@/api/visitor-service.js";

export default {
  components: {
    VisitorTable
  },
  data() {
    return {
      loading: true,
      visitors: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      firmId: null
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
        firm_id: that.firmId
      };

      visitorService
        .listProduct(params)
        .then(response => {
          that.visitors = response.data.list;
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
