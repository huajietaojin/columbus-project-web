<template>
  <div>
    <el-table :data="storeVideos" v-loading.body="loading" @selection-change="handleSelectionChange" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="视频ID" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="视频封面"  width="120" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover_picture" width="80" height="120"/>
        </template>
      </el-table-column>
      <el-table-column label="所属企业门店" align="left">
        <template slot-scope="scope">
          企业：{{scope.row.firm_id}}  &&  门店：{{scope.row.store_id}} / {{scope.row.store_name}}
        </template>
      </el-table-column>
      <el-table-column label="视频名称" width="240" align="left">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">{{scope.row.enable ? '上架' : '未上架'}}</el-tag>
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="权重" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.weight}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否审核" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.confirm | statusFilter">{{scope.row.confirm ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核结果" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.confirm_result | resultFilter">{{scope.row.confirm_result == 99 ? '通过' : '未通过'}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="text">
                下拉菜单
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'update-' + scope.row.id">修改</el-dropdown-item>
                <el-dropdown-item :command="'weight-' + scope.row.id">权重</el-dropdown-item>
                <el-dropdown-item :command="'detail-' + scope.row.id">详情查看</el-dropdown-item>
                <el-dropdown-item :command="'remove-' + scope.row.id + '-' + scope.row.name" divided>删除</el-dropdown-item>
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
    storeVideos: {
      type: Array
    }
  },
  filters: {
    statusFilter(status) {
      return status === true ? "success" : "warning";
    },
    resultFilter(val) {
      return val == 99 ? "success" : "danger";
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


