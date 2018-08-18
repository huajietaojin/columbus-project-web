<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item v-if="editable">
        <el-button type="primary" @click="onSubmit">提 交</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object
    }
  },
  watch: {
    user: function(val) {
      this.initForm(val);
    }
  },
  data() {
    return {
      form: {
        mobile: "",
        email: ""
      },
      rules: {
        mobile: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
          {
            min: 3,
            max: 120,
            message: "长度在 3 到 120 个字符",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "统一社会信用代码", trigger: "blur" },
          {
            min: 12,
            max: 20,
            message: "长度在 12 到 20 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    initForm(val) {
      if (!val) {
        return;
      }
      this.form = val;
    },
    onSubmit() {
      // this.$message('submit!')
      let that = this;
      this.$refs["form"].validate(valid => {
        if (valid === true) {
          this.form.province_no = this.province_no;
          this.form.city_no = this.city_no;
          this.form.region_no = this.region_no;
          that.$emit("submit", that.form);
        } else {
          that.$message({
            message: "请填写正确表单",
            type: "warning"
          });
        }
      });
    },
    onCancel() {
      this.$emit("cancel");
    }
  },
  created() {
    this.initForm(this.user);
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  border: 1px dashed #d9d9d9;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

