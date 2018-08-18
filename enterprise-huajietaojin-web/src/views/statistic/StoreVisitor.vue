<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify"></init-alert>
    </el-row>

    <el-row>
    <visitor-table :visitors="visitors" :loading="loading" @action="onAction"></visitor-table>
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
import { mapGetters } from "vuex";
import InitAlert from "@/components/InitAlert";

export default {
  components: {
    VisitorTable,
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
      visitors: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true
    };
  },
  methods: {
    onAction(key) {
      console.log("onAction", key);
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

      visitorService
        .listStore(params)
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
      const that = this;
      that.loading = true;
      if (that.firm && that.firm.id) {
        that.fetchData();
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
        clearInterval(handler);
      }, 500);
    }
  },
  created() {
    this.delayFetchData();
  }
};
</script>
