<template>
  <div>
    <el-table :data="products" v-loading.body="loading" @selection-change="handleSelectionChange" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column label="商品ID" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="所属门店" width="280" align="center">
        <template slot-scope="scope">
          {{scope.row.store_name}}
        </template>
      </el-table-column>
      <el-table-column label="是否上架" width="160" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">{{scope.row.enable ? '已上架' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="text">
                下拉菜单
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'update-' + scope.row.id">修改</el-dropdown-item>
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
    products: {
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


