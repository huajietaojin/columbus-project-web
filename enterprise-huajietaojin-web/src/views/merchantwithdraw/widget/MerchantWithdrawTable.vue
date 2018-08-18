<template>
  <div>
    <el-table :data="records" v-loading.body="loading" @selection-change="handleSelectionChange" element-loading-text="Loading" border fit highlight-current-row>
      
     <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column label="提现单号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.partner_trade_no}}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请提现金额(元)" width="150"  align="center">
        <template slot-scope="scope">
          <span>¥{{scope.row.withdraw_money_fen * 1.0 /100}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费率(%)" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.charge_permillage * 1.0 / 10}}%</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="提现手续费(元)" width="130" align="center">
        <template slot-scope="scope">
          <span>¥{{scope.row.charge_money_fen * 1.0 /100}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="最终到账金额(元)" width="150" align="center">
        <template slot-scope="scope">
          <span>¥{{scope.row.final_money_fen * 1.0 /100}}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现方式" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.withdraw_type == 1 ? "微信转账" : "银行转账"}}
        </template>
      </el-table-column>
      <el-table-column label="当前状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.withdraw_state | statusFilter">{{scope.row.withdraw_state === 99 ? '完成付款' : '转账中'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提现时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
                <el-dropdown-item :command="'detail-' + scope.row.id">详情查看</el-dropdown-item>
                <!-- <el-dropdown-item :command="'remove-' + scope.row.id + '-' + scope.row.name" divided>删除</el-dropdown-item> -->
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
      return status === 99 ? "success" : "warning";
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


