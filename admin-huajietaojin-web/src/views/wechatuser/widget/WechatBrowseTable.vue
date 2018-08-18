<template>
  <div>
    <el-table :data="wechatBrowses" v-loading.body="loading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="微信头像"  width="120" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar_url" width="40" height="40"/>
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.nick_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Openid" width="260" align="center">
        <template slot-scope="scope">
          {{scope.row.openid}}
        </template>
      </el-table-column>
      <el-table-column label="页面" width="170" align="center">
        <template slot-scope="scope">
          {{scope.row.path}}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.type}}
        </template>
      </el-table-column>
      <el-table-column label="场景" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.scene}}
        </template>
      </el-table-column>
      <el-table-column label="浏览时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.happen_at | parseTime('{y}/{m}/{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150" align="center">
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
        </el-table-column> -->
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
    wechatBrowses: {
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


