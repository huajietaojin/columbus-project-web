<template>
  <div class="pwd-contanier">
    <el-row type="flex" justify="center">
      <el-col class="form-area" :span="4" :xs="22" :sm="16" :md="11" :lg="7" :xl="4">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
          class="card-box login-form">
          <h3 class="title">重置密码</h3>
          <el-form-item prop="mobile">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input name="mobile" type="text" v-model="loginForm.mobile" autoComplete="on" placeholder="请输入注册手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
            <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
              placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="password2">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
            <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password2" autoComplete="on"
              placeholder="再次输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input name="code" type="text" v-model="loginForm.code" autoComplete="on" placeholder="请输入验证码" />
            <el-button type="primary" :disabled="disabled" @click="getCode" class="code-btn">{{btnText}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
              提 交
            </el-button>
          </el-form-item>
          
          <div class="tips">
            <div><span class="has-account-tip"></span><router-link :to="{ path: 'login' }" class="go-login">返回登录</router-link></div>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { Message } from "element-ui";
import { validatePhone, validateEmail } from "@/utils/validate";
import request from "@/utils/request";
import systemService from "@/api/system-service.js";

export default {
  name: "password",
  data() {
    const validatePhoneFn = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("请输入验证码"));
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
    const validatePass2 = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else if (value !== this.loginForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        mobile: "",
        code: "",
        password: "",
        password2: ""
      },
      btnText: "获取验证码",
      currentTime: 60,
      disabled: false,
      loginRules: {
        mobile: [
          { required: true, trigger: "blur", validator: validatePhoneFn }
        ],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
        password: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        password2: [
          { required: true, trigger: "blur", validator: validatePass2 }
        ]
      },
      loading: false
    };
  },
  methods: {
    // 获取验证码
    getCode() {
      if (!validatePhone(this.loginForm.mobile)) {
        this.$notify.warning("请输入正确的手机号码");
      } else {
        var that = this;
        // 获取短信验证码

        systemService
          .getDefaultUsageCode(this.loginForm.mobile)
          .then(response => {
            console.log(response.data);
            that.disabled = true;
            var currentTime = this.currentTime;
            var interval = setInterval(function() {
              currentTime--;
              that.btnText = currentTime + "秒";
              if (currentTime <= 0) {
                clearInterval(interval);
                that.btnText = "重新发送";
                that.urrentTime = 60;
                that.disabled = false;
              }
            }, 1000);
          })
          .catch(error => {
            this.$message.error(error.message);
          });
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;

          // 提交注册请求
          request({
            url: "/user-proxy/merchant/users/password",
            method: "post",
            data: {
              mobile: this.loginForm.mobile,
              code: this.loginForm.code,
              password: this.loginForm.password
            }
          })
            .then(response => {
              console.log(response.data);
              this.$message.success("修改成功");
              this.loading = false;
              this.$router.push({ path: "login" });
            })
            .catch(error => {
              console.log(error);
              this.$message.error(error.message);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
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

.pwd-contanier {
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
    color: #fff;
    margin-bottom: 10px;
    text-align: right;
    .has-account-tip {
      color: #afafaf;
    }
    .go-login {
      color: #efefef;
    }
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
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .form-area {
    margin-top: 120px;
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
  .code-btn {
    position: absolute;
    right: 3px;
    top: 3px;
    width: 112px;
  }
}
</style>
