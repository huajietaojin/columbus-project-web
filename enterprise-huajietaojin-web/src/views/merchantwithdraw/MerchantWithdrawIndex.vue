<template>
  <div class="app-container">
 
    <el-row>
    <merchant-withdraw-table :records="records" :loading="loading" @action="onAction" @selection-change="onSelecttionChange"></merchant-withdraw-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>

    <el-row>
      <el-dialog
      :close-on-click-modal="false"
      title="提现单详情"
      :visible.sync="dialogVisible"
      >
      <el-row v-loading="itemLoading">
      <merchant-withdraw-form :record="record" :editable="false" @cancel="dialogVisible = false"></merchant-withdraw-form>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </el-row>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import MerchantWithdrawTable from "./widget/MerchantWithdrawTable";
import MerchantWithdrawForm from "./widget/MerchantWithdrawForm";
import merchantWithdrawService from "@/api/merchant-withdraw-service.js";
import { mapGetters } from "vuex";
import { getUnid } from "@/utils/auth";

export default {
  components: {
    MerchantWithdrawTable,MerchantWithdrawForm
  },
  computed: {
    ...mapGetters(["user"]),
    hasUser: function() {
      return !this.user || !this.user.unid;
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
      selection: [],
      doing: false,
      dialogVisible: false,

      record:null,
      itemLoading: false
    };
  },
  methods: {
    onDownload() {
      window.location.href = this.qrcodeUrl;
    },
    onAction(key) {
      const arr = key.split("-");
      const type = arr[0];
      if (type === "detail") {
        console.log("xxxxxxx", arr[1]);
        //this.$router.push({ name: "MerchantWithdrawDetail", params: { id: arr[1] } });
        this.dialogVisible = true;
        this.getItem(arr[1]);
      } else {
        return;
      }
    },
    onSelecttionChange(list) {
      this.selection = list;
    },
    getItem(id) {
      let that = this;
      that.itemLoading = true;
      merchantWithdrawService
        .get(id)
        .then(response => {
          that.record = response.data;
          that.itemLoading = false;
        })
        .catch(err => {
          that.itemLoading = false;
          that.record = {};
          that.$message.error(err);
        });
    },
    fetchData() {
      if (!this.user || !this.user.unid) {
        this.loading = false;
        // console.log("firm empty");
        return;
      }

      const that = this;
      let unid = that.user.unid;

      that.offset = (that.page - 1) * that.limit;
      that.count = that.total < 1;
      const params = {
        $count: that.count,
        $limit: that.limit,
        $offset: that.offset,
        merchant_unid: unid
      };

      merchantWithdrawService
        .list(params)
        .then(response => {
          that.records = response.data.list;
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
    handleCurrentChange: function(page) {
      // console.log(`当前页: ${page}`);
      this.page = page;
      this.fetchData();
    },
    delayFetchData() {
      const that = this;
      if (that.user && that.user.unid) {
        that.fetchData();
        return;
      }
      let i = 0;
      let handler = setInterval(function() {
        if (i++ > 3) {
          clearInterval(handler);
        }
        console.log("delayFetchData");
        if (!that.user || !that.user.unid) {
          return;
        }
        that.fetchData();
        clearInterval(handler);
      }, 800);
    }
  },
  created() {
    if (!this.user || !this.user.id) {
      this.$store.dispatch("GetInfo");
    }
    this.delayFetchData();
  }
};
</script>
