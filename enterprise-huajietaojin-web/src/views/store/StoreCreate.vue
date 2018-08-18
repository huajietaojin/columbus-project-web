<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify" color="error"></init-alert>
    </el-row>
    
    <el-row>
      <store-form :editable="editable" :firm="firm" :notify="notify" :loading="loading" @submit="submitForm"></store-form>
    </el-row>
  </div>
</template>

<script>
import StoreForm from "./widget/StoreForm";
import storeService from "@/api/store-service.js";
import { mapGetters } from "vuex";
import InitAlert from "@/components/InitAlert";

export default {
  components: {
    StoreForm,
    InitAlert
  },
  computed: {
    ...mapGetters(["firm"]),
    notify: function() {
      return !this.firm || !this.firm.id;
    }
  },
  data() {
    return {
      editable: true,
      loading: false
    };
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      that.loading = true;
      storeService
        .create(params)
        .then(res => {
          that.$message.success("提交成功");
          that.loading = false;
          that.$router.push({ name: "StoreIndex" });
        })
        .catch(err => {
          that.$message.error(err);
          that.loading = false;
        });
    }
  }
};
</script>
