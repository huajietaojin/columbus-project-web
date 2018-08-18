<template>
  <div class="app-container">
    <el-row>
      <store-chart></store-chart>
    </el-row>
    <el-row>
      <el-tag>微信浏览访客</el-tag>
    </el-row>
    <el-row>
      <store-visitor></store-visitor>
    </el-row>
  </div>
</template>

<script>
import StoreChart from "./StoreChart";
import StoreVisitor from "./StoreVisitor";

export default {
  components: {
    StoreChart,
    StoreVisitor
  }
};
</script>
