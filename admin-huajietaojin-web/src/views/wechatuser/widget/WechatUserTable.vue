<template>
  <div>
    <el-table :data="wechatUsers" v-loading.body="loading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="微信头像"  width="120" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl != '' ? scope.row.avatarUrl : 'https://huajietaojin.oss-cn-hangzhou.aliyuncs.com/enterprise/pic/weixin.png'" width="40" height="40"/>
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Openid" width="280" align="center">
        <template slot-scope="scope">
          {{scope.row.openid}}
        </template>
      </el-table-column>
      <el-table-column label="省份" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.province}}
        </template>
      </el-table-column>
      <el-table-column label="城市" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.city}}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="70" align="center">
        <template slot-scope="scope">
          {{scope.row.gender}}
        </template>
      </el-table-column>
      <el-table-column label="手机尾号" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
    wechatUsers: {
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


