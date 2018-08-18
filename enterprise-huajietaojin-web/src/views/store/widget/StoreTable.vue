<template>
  <div>
    <el-table :data="stores" v-loading.body="loading" @selection-change="handleSelectionChange" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column  width="120" label="店铺Logo" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" width="64" height="64"/>
        </template>
      </el-table-column>
      <el-table-column  width="220" label="店铺名称" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="店铺地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column width="220" label="转发标题" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.cover_title}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="联系方式" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.contact}}
        </template>
      </el-table-column> -->
      <el-table-column label="是否启用" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">{{scope.row.enable ? '已启用' : '否'}}</el-tag>
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
    stores: {
      type: Array
    }
  },
  filters: {
    statusFilter(status) {
      return status === true ? "success" : "warning";
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


