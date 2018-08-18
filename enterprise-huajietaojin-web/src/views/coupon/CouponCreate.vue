<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify" color="error"></init-alert>
    </el-row>

    <el-row>
    <coupon-form :stores="stores" :editable="editable" :loading="loading" @submit="submitForm"></coupon-form>
    </el-row>
  </div>
</template>

<script>
import CouponForm from "./widget/CouponForm";
import couponService from "@/api/coupon-service.js";
import storeService from "@/api/store-service.js";
import { mapGetters } from "vuex";
import InitAlert from "@/components/InitAlert"

export default {
  components: {
    CouponForm,InitAlert
  },
  computed: {
    ...mapGetters(["firm"]),
    notify: function() {
      return !this.firm || !this.firm.id;
    }
  },
  data() {
    return {
      editable: true,
      stores: [],
      loading: false
    };
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      that.loading = true;
      couponService
        .create(params)
        .then(res => {
          console.log("create", res);
          that.$message({
            message: "提交成功",
            type: "success"
          });
          that.loading = false;
          that.$router.push({ name: "CouponIndex" });
        })
        .catch(err => {
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
    }
  },
  created() {
    this.listStores();
  }
};
</script>
