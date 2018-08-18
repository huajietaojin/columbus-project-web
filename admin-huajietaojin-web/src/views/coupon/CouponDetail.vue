<template>
  <div class="app-container">
    <el-row>
      <coupon-form :stores="stores" :coupon="coupon" :editable="editable"></coupon-form>
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
      editable: false,
      coupon: null,
      couponId: null,
      stores: []
    };
  },
  created() {
    this.couponId = this.$route.params.id;
    this.fetchData(this.$route.params.id);
  },
  methods: {
    fetchData(id) {
      const that = this;
      couponService.get(id).then(response => {
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
