<template>
  <div class="app-container">
    <el-row>
      <product-chart></product-chart>
    </el-row>
    <el-row>
      <el-tag>微信浏览访客</el-tag>
    </el-row>
    <el-row>
      <product-visitor></product-visitor>
    </el-row>
  </div>
</template>

<script>
import ProductChart from "./ProductChart";
import ProductVisitor from "./ProductVisitor";

export default {
  components: {
    ProductChart,
    ProductVisitor
  }
};
</script>
