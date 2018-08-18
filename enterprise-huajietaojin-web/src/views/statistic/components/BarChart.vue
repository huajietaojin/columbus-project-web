<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "550px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHanlder);
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    sidebarElm.addEventListener("transitionend", this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHanlder);
    }

    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    sidebarElm.removeEventListener("transitionend", this.__resizeHanlder);

    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        let option = this.formatOption(val);
        this.setOptions(option);
      }
    }
  },
  methods: {
    setOptions(data) {
      this.chart.setOption(data);
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    formatOption(raw) {
      let option = {
        title: {
          text: raw.chartName || "报表"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        color: ["#003366", "#e5323e"],
        legend: {
          data: ["ItemOne", "ItemTow"]
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          feature: {
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: {
          type: "category",
          axisTick: { show: false },
          data: []
        },
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "ItemOne",
            type: "bar",
            barGap: 0,
            data: []
          },
          {
            name: "ItemTow",
            type: "bar",
            data: []
          }
        ]
      };

      option.xAxis.data = raw.xAxisData || ["1", "2", "3", "4", "5"];
      option.legend.data = raw.legendData;

      let series = [];
      for (let obj of raw.series) {
        let item = {
          name: obj.name,
          type: "bar",
          label: {
            normal: {
              show: true,
              rotate: 90,
              align: "left",
              verticalAlign: "middle",
              position: "inside"
            }
          },
          data: obj.data
        };
        series.push(item);
      }
      option.series = series;
      return option;
    }
  }
};
</script>
