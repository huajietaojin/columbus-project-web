<template>
    <div class="app-container">
    <el-row>
      <coupon-chart></coupon-chart>
    </el-row>
    <el-row>
      <el-tag>微信浏览访客</el-tag>
    </el-row>
    <el-row>
      <coupon-visitor></coupon-visitor>
    </el-row>
    </div>
</template>

<script>
import CouponChart from "./CouponChart";
import CouponVisitor from "./CouponVisitor";

export default {
  components: {
    CouponChart,
    CouponVisitor
  }
};
</script>
