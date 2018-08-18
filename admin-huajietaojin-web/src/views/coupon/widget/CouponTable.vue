<template>
  <div>
    <el-table :data="coupons" v-loading.body="loading" @selection-change="handleSelectionChange" element-loading-text="Loading" border fit highlight-current-row>
     <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="现金券ID" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="转发封面"  width="120" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.picture" width="80" height="60"/>
        </template>
      </el-table-column>
      <el-table-column label="所属企业门店" align="left">
        <template slot-scope="scope">
          企业：{{scope.row.firm_id}} && 门店：{{scope.row.store_id}} / {{scope.row.store_name}}
        </template>
      </el-table-column>
      <el-table-column label="现金券内容" width="245" align="left">
        <template slot-scope="scope" >
          <el-tag :type="scope.row.type | typeFilter">{{scope.row.type === 1 ? '抵扣券' : '打折券'}}</el-tag>
          &nbsp;&nbsp;{{scope.row.content}} {{scope.row.type === 1 ? ' 元' : ' 折'}} 
          &nbsp;&nbsp;
          <span v-if="scope.row.force_share">
          <el-tag type="danger">强制分享</el-tag>
          </span>
          <span v-else>
            直接使用
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最低消费" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.base_price}} ¥
        </template>
      </el-table-column>
      <el-table-column label="转发标题" width="170" align="left">
        <template slot-scope="scope">
          {{scope.row.retweet_title}}
        </template>
      </el-table-column>
      
      <el-table-column label="是否发行" width="90" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">{{scope.row.enable ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="text">
                下拉菜单
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'update-' + scope.row.id">修改</el-dropdown-item>
                <el-dropdown-item :command="'detail-' + scope.row.id">详情查看</el-dropdown-item>
                <el-dropdown-item :command="'preview-' + scope.row.id">小程序预览</el-dropdown-item>
                <el-dropdown-item :command="'remove-' + scope.row.id + '-' + scope.row.intro" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    coupons: {
      type: Array
    }
  },
  filters: {
    shareFilter(status) {
      return status === true ? "danger" : "info";
    },
    statusFilter(status) {
      return status === true ? "success" : "warning";
    },
    typeFilter(type) {
      const typeMap = {
        1: "primary",
        2: "info"
      };
      return typeMap[type];
    }
  },
  methods: {
    handleCommand: function(key) {
      this.$emit("action", key);
    },
    handleSelectionChange: function(list) {
      this.$emit("selection-change", list);
    }
  }
};
</script>


