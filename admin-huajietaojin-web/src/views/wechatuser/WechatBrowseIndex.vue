<template>
  <div class="app-container">

    <el-row :gutter="12" >
        <el-col :span="6">
          <el-input v-model="openid" placeholder="微信Openid"></el-input>
        </el-col>
        <!-- <el-col :span="6">
          <el-input v-model="mobile" placeholder="手机号"></el-input>
        </el-col> -->
        <el-col :span="6">
          <el-button plain type="primary" @click="onSearch">查询</el-button>
          <el-button plain type="info" @click="onReset">重置</el-button>
        </el-col>
    </el-row>

    <el-row>
    <wechat-browse-table :type="2" :wechat-browses="wechatBrowses" :loading="loading" @action="onAction"></wechat-browse-table>
    </el-row>

    <el-row type="flex" justify="end">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import WechatBrowseTable from "./widget/WechatBrowseTable";
import wechatBrowseService from "@/api/wechat-browse-service.js";

export default {
  components: {
    WechatBrowseTable
  },
  data() {
    return {
      loading: true,
      wechatBrowses: [],
      page: 1,
      total: 0,
      limit: 10,
      offset: 0,
      count: true,
      firmId: null,
      openid: null,
    };
  },
  methods: {
    onAction(key) {
      console.log("onAction", key);
    },
    fetchData() {

      const that = this;
      that.offset = (that.page - 1) * that.limit;
      that.count = that.total < 1;
      const params = {
        $count: that.count,
        $limit: that.limit,
        $offset: that.offset,
        openid: that.openid,
      };

      wechatBrowseService
        .list(params)
        .then(response => {
          that.wechatBrowses = response.data.list;
          if (that.count) {
            that.total = response.data.total;
          }
          that.loading = false;
        })
        .catch(err => {
          console.log("list err", err);
          that.$message.error(err);
          that.loading = false;
        });
    },
    onSearch: function() {
      this.total = 0;
      this.fetchData();
    },
    onReset: function() {
      this.openid = null;
      this.page = 1;
      this.total = 0;
      this.fetchData();
    },
    handleCurrentChange: function(page) {
      // console.log(`当前页: ${page}`);
      this.page = page;
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
