<template>
  <div class="app-container" >
    <el-row>
    <firm-form :firm="firm" :editable="!hasFirm || editable" @submit="submitForm" @cancel="onCancel"></firm-form>
    </el-row>

    <el-row v-if="!editable">
      <el-col :span="6" :offset="2">
        <el-button type="primary" @click="onModify">编 辑</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import FirmForm from "./widget/FirmForm";
import firmService from "@/api/firm-service.js";

export default {
  components: {
    FirmForm
  },
  computed: {
    ...mapGetters(["firm"]),
    hasFirm: function() {
      return this.firm && this.firm.license_code;
    }
  },
  data() {
    return {
      editable: false
    };
  },
  created() {
    if (!this.hasFirm) {
      this.editable = true;
    }
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      firmService
        .createOrupdate(params)
        .then(res => {
          console.log("update", res);
          that.$message.success("提交成功");
          that.editable = false;
          that.$store.dispatch("FetchFirmData");
        })
        .catch(err => {
          that.editable = false;
          that.$message.error(err);
        });
    },
    onModify() {
      this.editable = true;
    },
    onCancel() {
      this.editable = false;
    }
  }
};
</script>
