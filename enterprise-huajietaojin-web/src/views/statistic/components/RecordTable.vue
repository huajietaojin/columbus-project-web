<template>
  <div>
    <el-table :data="records" v-loading.body="loading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column  width="240" label="店铺名称" align="center">
        <template slot-scope="scope">
          {{scope.row.store_name}}
        </template>
      </el-table-column>
      <el-table-column label="微信头像"  width="120" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar_url" width="40" height="40"/>
        </template>
      </el-table-column>
      <el-table-column label="顾客昵称" align="center">
        <template slot-scope="scope">
          {{scope.row.nick_name}}
        </template>
      </el-table-column>
      <el-table-column label="最终价格(元)" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.final_money_fen /100}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
                <!-- <el-dropdown-item :command="'update-' + scope.row.id">修改</el-dropdown-item> -->
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
    records: {
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
    }
  }
};
</script>


