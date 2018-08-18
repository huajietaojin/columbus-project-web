<template>
  <div class="app-container">

    <el-row>
    <account-profile-table :type="2" :records="accountProfiles" :loading="loading" @action="onAction"></account-profile-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>

    <el-dialog
      title="设置费率"
      :visible.sync="chargeDiaolog"
      width="420px">
      <el-row>
        <span>当前商户费率 千分之 {{oldChargePermillage}}，请谨慎操作。</span>
      </el-row>
      <el-row>
        <el-input-number v-model.number="chargeRecord.charge_permillage" :step="1" :min="0" :max="1000" controls-position="right" style="width:90%;"></el-input-number>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeDiaolog = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateCharge">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import AccountProfileTable from "./widget/AccountProfileTable";
import merchantAccountService from "@/api/merchant-account-service.js";

export default {
  components: {
    AccountProfileTable
  },
  data() {
    return {
      loading: true,
      accountProfiles: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,

      chargeDiaolog: false,
      oldChargePermillage: 9,
      chargeRecord: {
        charge_permillage: 9
      }
    };
  },
  methods: {
    onUpdateCharge() {
      let param = {
        charge_permillage: this.chargeRecord.charge_permillage
      };
      const that = this;
      merchantAccountService
        .updateAccountCharge(this.chargeRecord.merchant_unid, param)
        .then(res => {
          that.fetchData();
          that.chargeDiaolog = false;
          that.$message.success("修改成功");
        })
        .catch(err => {
          that.$message.error(err);
          that.chargeDiaolog = false;
        });
    },
    onAction(key) {
      console.log("onAction", key);
      const arr = key.split("-");
      const type = arr[0];
      if (type === "charge") {
        let id = arr[1];
        for (let m of this.accountProfiles) {
          if (id == m.id) {
            this.chargeRecord = m;
            this.oldChargePermillage = m.charge_permillage;
            this.chargeDiaolog = true;
            return;
          }
        }
        this.chargeDiaolog = false;
        return;
      } else {
        return;
      }
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
        .listAccountProfile(params)
        .then(response => {
          that.accountProfiles = response.data.list;
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
