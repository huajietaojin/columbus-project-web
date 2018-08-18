<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify"></init-alert>
    </el-row>
    
    <div class="chart-container">
        <bar-chart height='100%' width='100%' :chart-data="chartData"></bar-chart>
    </div>
  </div>
</template>

<script>
import BarChart from "./components/BarChart";
import statistic from "@/api/statistic-service.js";
import { mapGetters } from "vuex";
import InitAlert from "@/components/InitAlert";

export default {
  name: "tradingChart",
  components: {
    BarChart,
    InitAlert
  },
  computed: {
    ...mapGetters(["firm"]),
    notify: function() {
      return !this.firm || !this.firm.id;
    }
  },
  data() {
    return {
      chartData: {}
    };
  },
  methods: {
    fetchData() {
      if (!this.firm || !this.firm.id) {
        return;
      }
      const that = this;
      let firmId = that.firm.id;
      let param = {
        firm_id: firmId
      };
      statistic.getMoneyChart(param).then(response => {
        let data = response.data;
        let chartData = {
          xAxisData: data.x_axis_data || [],
          legendData: data.legend_data || [],
          series: data.series || [],
          chartName: "交易数据"
        };
        that.chartData = chartData;
      });
    },
    delayFetchData() {
      const that = this;
      that.loading = true;
      if (that.firm && that.firm.id) {
        that.fetchData();
        return;
      }
      let i = 0;
      let handler = setInterval(function() {
        if (i++ > 6) {
          that.loading = false;
          clearInterval(handler);
        }
        console.log("delayFetchData");
        if (!that.firm || !that.firm.id) {
          return;
        }
        that.fetchData();
        clearInterval(handler);
      }, 500);
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
