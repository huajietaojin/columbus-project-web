<template>
  <div class="login-container">
     <el-row type="flex" justify="center">
      <el-col class="form-area" :span="4" :xs="22" :sm="16" :md="11" :lg="7" :xl="4">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
      <h3 class="title">花街淘金</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入电话号码" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :disabled="loading" :loading="loading" @click.native.prevent="handleLogin">
          登 录
        </el-button>
      </el-form-item>
      <div class="tips">
        <span>内部账号</span>
      </div>
    </el-form>
    </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false
    };
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$store.dispatch("GetInfo");
              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch(err => {
              this.loading = false;
              this.$message.error("手机号或密码错误！");
              console.log("handleLogin error", err);
            });
        } else {
          console.log("error submit!!");
          this.loading = false;
          this.$message.error("有错误，请重试！");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100%;
  width: 100%;
  background-color: $bg;
  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .tips {
    font-size: 14px;
    color: #9f9f9f;
    margin-bottom: 10px;
    text-align: right;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .form-area {
    margin-top: 100px;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
