<template>
  <div class="app-container" >
    <el-row>
    <user-form :user="user" :editable="editable" @submit="submitForm" @cancel="onCancel"></user-form>
    </el-row>

    <el-row v-if="!editable">
      <el-col :span="6" :offset="2">
        <el-button type="primary" @click="onModify">编 辑</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserForm from "./widget/UserForm";
import userService from "@/api/merchant-user-service.js";
import { mapGetters } from "vuex";

export default {
  components: {
    UserForm
  },
  computed: {
    ...mapGetters(["user"]),
    hasUser: function() {
      return !this.user || !this.user.unid;
    }
  },
  data() {
    return {
      editable: false
    };
  },
  created() {
    // console.log("PersonSetting");
    if (!this.user || !this.user.id) {
      this.$store.dispatch("GetInfo");
    }
  },
  methods: {
    submitForm: function(params) {
      if (this.hasUser === false) {
        this.$message.error("请重试");
      }
      const that = this;
      userService
        .update(this.user.unid, params)
        .then(res => {
          that.$store.dispatch("GetInfo");
          that.$message.success("提交成功");
          that.editable = false;
        })
        .catch(err => {
          that.$message.error(err);
        });
    },
    onModify() {
      this.editable = true;
    },
    onReset() {
      this.editable = false;
    },
    onCancel() {
      this.editable = false;
    }
  }
};
</script>
