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
      title="请用微信扫描下面二维码"
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
import { getUnid } from "@/utils/auth";

export default {
  components: {
    MerchantWithdrawTable,MerchantWithdrawForm
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
      const that = this;
      that.offset = (that.page - 1) * that.limit;
      that.count = that.total < 1;
      const params = {
        $count: that.count,
        $limit: that.limit,
        $offset: that.offset
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
  },
  created() {
    this.fetchData();
  }
};
</script>
