<template>
  <div class="app-container">
    <el-row>
      <merchant-withdraw-form :record="record" :editable="editable"></merchant-withdraw-form>
    </el-row>
  </div>
</template>

<script>
import MerchantWithdrawForm from "./widget/MerchantWithdrawForm";
import merchantWithdrawService from "@/api/merchant-withdraw-service.js";

export default {
  components: {
    MerchantWithdrawForm
  },
  data() {
    return {
      editable: false,
      record: null,
      recordId: null
    };
  },
  created() {
    this.recordId = this.$route.params.id;
    this.fetchData(this.$route.params.id);
  },
  methods: {
    onCancel() {
      this.$router.push({ name: "MerchantWithdrawIndex" });
    },
    fetchData(id) {
      let that = this;
      merchantWithdrawService.get(id).then(response => {
        that.record = response.data;
      });
    }
  }
};
</script>
