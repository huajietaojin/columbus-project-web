<template>
  <div>
    <el-table :data="firms" v-loading.body="loading" @selection-change="handleSelectionChange" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="企业ID" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="left">
        <template slot-scope="scope">
          {{scope.row.legal_name}}
        </template>
      </el-table-column>
      <el-table-column label="统一社会信用代码" width="180" align="left">
        <template slot-scope="scope">
          <span>{{scope.row.license_code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="法定代表人" width="120" align="left">
        <template slot-scope="scope">
          {{scope.row.legal_person}}
        </template>
      </el-table-column>
      <el-table-column label="省份" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.province_no}}
        </template>
      </el-table-column>
      <el-table-column label="城市" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.city_no}}
        </template>
      </el-table-column>
      <el-table-column label="是否认证" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.confirm | statusFilter">{{scope.row.confirm ? '认证' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">{{scope.row.enable ? '启用' : '否'}}</el-tag>
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
    firms: {
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


