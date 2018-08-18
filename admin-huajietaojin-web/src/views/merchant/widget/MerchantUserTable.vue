<template>
  <div>
    <el-table :data="records" v-loading.body="loading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="商家UNID" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.unid}}
        </template>
      </el-table-column>
      <el-table-column label="商家手机" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="EMAIL" width="180" align="center">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
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
                <el-dropdown-item :command="'detail-' + scope.row.id">详情查看</el-dropdown-item>
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
    },
    type: {
      type: Number,
      default: 0
    },
  },
  methods: {
    handleCommand: function(key) {
      this.$emit("action", key);
    }
  }
};
</script>


