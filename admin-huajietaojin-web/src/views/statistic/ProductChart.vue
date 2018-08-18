<template>
  <div class="app-container">

    <el-row class="chart-container">
        <line-chart height='100%' width='100%' :chart-data="chartData"></line-chart>
    </el-row>
  </div>
</template>

<script>
import LineChart from "./components/LineChart";
import statistic from "@/api/statistic-service.js";

export default {
  name: "businessChart",
  components: {
    LineChart
  },
  data() {
    return {
      chartData: {},
      firmId: null
    };
  },
  methods: {
    fetchData() {
      const that = this;
      let param = {
        firm_id: that.firmId
      };
      statistic.getProductChart(param).then(response => {
        let data = response.data;
        let chartData = {
          xAxisData: data.x_axis_data || [],
          legendData: data.legend_data || [],
          series: data.series || [],
          chartName: "商品趋势数据"
        };
        that.chartData = chartData;
      });
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
<style scoped>
.chart-container {
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
</style>
