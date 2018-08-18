<template>
  <div class="app-container">
    <el-row>
      <coupon-form :stores="stores" :coupon="coupon" :editable="editable" :loading="loading" @submit="submitForm"></coupon-form>
    </el-row>
  </div>
</template>

<script>
import CouponForm from "./widget/CouponForm";
import couponService from "@/api/coupon-service.js";
import storeService from "@/api/store-service.js";

export default {
  components: {
    CouponForm
  },
  data() {
    return {
      editable: true,
      coupon: null,
      couponId: null,
      stores: [],
      loading: false
    };
  },
  created() {
    this.couponId = this.$route.params.id;
    this.fetchData();
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      that.loading = true;
      couponService
        .update(this.couponId, params)
        .then(res => {
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
    fetchData() {
      const that = this;
      couponService.get(that.couponId).then(response => {
        that.coupon = response.data;
        that.listStores(that.coupon.firm_id);
      });
    },
    listStores(firmId) {
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
  }
};
</script>
