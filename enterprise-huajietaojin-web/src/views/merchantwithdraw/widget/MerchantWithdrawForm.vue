<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="提现单号">
        <el-input v-model="form.partner_trade_no" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="申请提现金额(元)">
        <el-input v-model="form.withdraw_money_yuan" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="手续费率(%)">
        <el-input v-model="form.charge_permillage" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item label="提现手续费(元)">
        <el-input v-model="form.charge_money_yuan" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="最终到账金额(元)">
        <el-input v-model="form.final_money_yuan" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="完成时间">
        <el-input v-model="form.update_at" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="申请时间">
        <el-input v-model="form.create_at" :disabled="true"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { parseTime } from "@/utils";

export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    record: {
      type: Object
    }
  },
  watch: {
    record: function(val) {
      let form = {
        partner_trade_no: val.partner_trade_no,
        withdraw_money_yuan: "¥ " + (val.withdraw_money_fen * 1.0 /100),
        charge_permillage: (val.charge_permillage * 1.0 / 10) + "%",
        charge_money_yuan: "¥ " + (val.charge_money_fen * 1.0 /100),
        final_money_yuan: "¥ " + (val.final_money_fen * 1.0 /100),
        withdraw_type:  val.withdraw_type == 1 ? "微信转账" : "银行转账",
        withdraw_state: 1,
        update_at: parseTime(val.update_at),
        create_at: parseTime(val.create_at),
      };
      this.form = form;
    }
  },
  data() {
    return {
      form: {
        withdraw_money_yuan: "",
        charge_permillage: "",
        charge_money_yuan: "",
        final_money_yuan: "",
        withdraw_type:  "",
        withdraw_state: 1,
        update_at: "",
        create_at: "",
      },
    };
  },
  methods: {
    onCancel() {
      this.$emit("cancel");
    }
  },
  created() {
    
  }
};
</script>