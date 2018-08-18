<template>
  <div class="app-container">
    <el-table :data="firms" v-loading.body="loading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column label="企业名称" align="center">
        <template slot-scope="scope">
          {{scope.row.legal_name}}
        </template>
      </el-table-column>
      <el-table-column  width="260" label="统一社会信用代码" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.license_code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="法定代表人" width="160" align="center">
        <template slot-scope="scope">
          {{scope.row.legal_person}}
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.enable}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
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
  methods: {
    handleCommand: function(key) {
      this.$emit("action", key);
    }
  }
};
</script>


