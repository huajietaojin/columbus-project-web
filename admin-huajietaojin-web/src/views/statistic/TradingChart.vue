<template>
  <div class="app-container">
    <el-row :gutter="12" >
      <el-col :span="4">
        <el-input v-model="firmId" placeholder="企业ID"></el-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="storeId" @focus="onFocus" :loading="storePulling" filterable clearable placeholder="选择门店" style="width: 100%;">
          <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button plain type="primary" @click="onSearch">查询</el-button>
        <el-button plain type="info" @click="onReset">重置</el-button>
      </el-col>
    </el-row>
    
    <el-row class="chart-container">
        <bar-chart height='100%' width='100%' :chart-data="chartData"></bar-chart>
    </el-row>
  </div>
</template>

<script>
import BarChart from "./components/BarChart";
import statistic from "@/api/statistic-service.js";
import storeService from "@/api/store-service.js";

export default {
  name: "tradingChart",
  components: {
    BarChart
  },
  data() {
    return {
      chartData: {},
      stores: [],
      storeId: null,
      firmId:null,
      storePulling: false
    };
  },
  methods: {
    onFocus(e) {
      if (!this.firmId) {
        this.$notify.warning("请先选择企业");
        return;
      }
      this.listStores();
    },
    fetchData() {
      const that = this;
      let param = {
        firm_id: that.firmId
      };
      statistic.getMoneyChart(param).then(response => {
        let data = response.data;
        let chartData = {
          xAxisData: data.x_axis_data || [],
          legendData: data.legend_data || [],
          series: data.series || [],
          chartName: "交易数据"
        };
        console.log('chartData', chartData)
        that.chartData = chartData;
      });
    },
    listStores() {
      if (!this.firmId) {
        return;
      }

      const that = this;
      that.storePulling = true;
      const params = {
        $limit: 1000,
        $offset: 0,
        firm_id: that.firmId
      };

      storeService
        .list(params)
        .then(response => {
          that.stores = response.data.list;
          that.storePulling = false;
        })
        .catch(err => {
          that.storePulling = false;
          that.$message.error(err)
        });
    },
    onSearch: function() {
      if (!this.firmId) {
        this.$notify.warning("请先选择企业");
        return;
      }
      this.fetchData();
    },
    onReset: function() {
      this.firmId = null;
      this.storeId = null;
      this.stores = [];
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
<style scoped>
.chart-container {
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
</style>
