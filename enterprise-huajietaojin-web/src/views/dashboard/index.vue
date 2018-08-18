<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row>
      <init-alert :notify="notify"></init-alert>
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
        <span style="ont-family:arial;color:#b8b8b8;font-weight: 300;">
          Copyright &copy; 2018 福州花街淘金网络科技有限公司. All rights reserved.
        </span>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import statistic from "@/api/statistic-service.js";
import InitAlert from "@/components/InitAlert";

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
    LineChart,
    InitAlert
  },
  computed: {
    ...mapGetters(["firm"]),
    notify: function() {
      return !this.firm || !this.firm.id;
    },
    typeName: function() {
      return TYPE_NAME[this.type];
    }
  },
  data() {
    return {
      lineChartData: {},
      type: "coupons",
      doing: false,
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
      if (!this.firm || !this.firm.id) {
        return;
      }
      const that = this;
      let firmId = that.firm.id;
      let param = {
        firm_id: firmId
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
      if (!this.firm || !this.firm.id) {
        return;
      }
      const that = this;
      let firmId = that.firm.id;
      let param = {
        firm_id: firmId
      };
      statistic.getDataDaily(param).then(response => {
        let data = response.data;
        // console.log("data", data);
        that.dailyData = data;
      });
    },
    delayFetchData() {
      const that = this;
      if (that.firm && that.firm.id) {
        that.fetchChartData();
        that.fetchDailyData();
        return;
      }
      let handler = setInterval(function() {
        console.log("delayFetchData");
        if (!that.firm || !that.firm.id) {
          clearInterval(handler);
          return;
        }
        that.fetchChartData();
        that.fetchDailyData();
        clearInterval(handler);
      }, 500);
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
