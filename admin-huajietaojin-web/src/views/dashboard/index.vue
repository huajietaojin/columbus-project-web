<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row :gutter="12" >
        <el-col :span="6">
          <el-input v-model="firmId" placeholder="企业ID"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button plain type="primary" @click="onSearch">查询</el-button>
          <el-button plain type="info" @click="onReset">重置</el-button>
        </el-col>
      </el-row>

      <el-row>
        <panel-group :daily-data="dailyData" @handleSetLineChartData="handleSetLineChartData"></panel-group>
      </el-row>

      <el-row>
        <span>{{typeName}}</span>
      </el-row>
      
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData"></line-chart>
      </el-row>

      <el-row>
        <span>
          <el-button :loading="doing" :disabled="doing" @click="onRefresh">刷新</el-button>
        </span>
      </el-row>
      <el-row type="flex" justify="end">
        <span style="color:#eaeaea;">
          <span style="font-family:arial;">Copyright &copy; 2018</span> 福州花街淘金网络科技有限公司. All rights reserved.
        </span>
      </el-row>
    </div>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import statistic from "@/api/statistic-service.js";

const TYPE_NAME = {
  coupons: "现金券浏览数环比",
  products: "商品浏览数环比",
  stores: "门店浏览数环比",
  money: "交易额环比"
};

export default {
  name: "dashboard",
  components: {
    PanelGroup,
    LineChart
  },
  computed: {
    typeName: function() {
      return TYPE_NAME[this.type];
    }
  },
  data() {
    return {
      lineChartData: {},
      type: "coupons",
      doing: false,
      firmId: null,
      dailyData: {
        product_total: 0,
        coupon_total: 0,
        store_total: 0,
        money_total: 0
      }
    };
  },
  methods: {
    handleSetLineChartData(type) {
      // console.log("type", type);
      // this.lineChartData = lineChartData[type];
      this.type = type;
      this.fetchChartData();
    },
    fetchChartData() {
      const that = this;
      let param = {
        firm_id: that.firmId
      };
      statistic.getDataContrast(this.type, param).then(response => {
        let data = response.data;
        // console.log("data", data);
        let lineChartData = {
          xAxisData: data.x_axis_data || [],
          todayData: data.today_data || [],
          yestodayData: data.yestoday_data || []
        };

        that.lineChartData = lineChartData;
      });
    },
    fetchDailyData() {
      const that = this;
      let param = {
        firm_id: that.firmId
      };

      statistic.getDataDaily(param).then(response => {
        let data = response.data;
        // console.log("data", data);
        that.dailyData = data;
      });
    },
    delayFetchData() {
      this.fetchChartData();
      this.fetchDailyData();
    },
    onSearch: function() {
      this.total = 0;
      this.delayFetchData();
    },
    onReset: function() {
      this.firmId = null;
      this.page = 1;
      this.total = 0;
      this.delayFetchData();
    },
    onRefresh() {
      this.doing = true;
      this.delayFetchData();
      const that = this;
      setTimeout(function() {
        that.doing = false;
      }, 600);
    }
  },
  created() {
    this.delayFetchData();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
