<template>
  <div class="app-container" >
    
    <el-row>
        <el-alert v-if="notify"
          title="您还没有设置用于接收平台打款的商家用户微信"
          type="warning"
          show-icon>
        </el-alert>
    </el-row>

    <el-row type="flex" justify="space-between" align="middle">
       <el-col :span="12" :xs="22" :sm="20" :md="18" :lg="12" :xl="12">
          <span>商家用户 {{mobileShow}}</span>
       </el-col>
       <el-col :span="1" :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
          <el-popover
            placement="top-start"
            title="帮助"
            width="320"
            trigger="hover"
            >
            <el-row>
              <span>【平台营业账户】：消费者线上买单结账时支付的金额存入该账户</span>
            </el-row>
            <el-row>
              <span>【平台其他账户】：商家发行现金券时存入的保证金等款项账户</span>
            </el-row>
            <el-row>
              <span>提示1：账户现金提现当前暂时支持微信提现，提现请求受理后平台将款项转账至商家指定的用户微信中</span>
            </el-row>
            <el-row>
              <span>提示2：商家在指定接收平台打款的用户微信时，需支付一个随机金额至平台进行用户微信有效性验证</span>
            </el-row>
            <el-button size="mini" slot="reference"><i class="el-icon-question"></i></el-button>
          </el-popover>
       </el-col>
    </el-row>

    

    <el-row>
        <panel-group :daily-data="accountMoney" @handleSetLineChartData="handleSetLineChartData"></panel-group>
    </el-row>

    <el-row>
      <el-collapse accordion>
        <el-collapse-item title="商家账户资料">
          <div>
            <el-row>
              <el-col :span="6">
                接收平台打款的用户微信
              </el-col>
              <el-col :span="2">
                <i class="el-icon-circle-check" v-if="hasWechatOpenid"></i>
                <i class="el-icon-close" v-else></i>
              </el-col>
              <el-col :span="16">
                {{nickName}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                商家用户真实姓名
              </el-col>
              <el-col :span="2">
                <i class="el-icon-circle-check" v-if="hasRealName"></i>
                <i class="el-icon-close" v-else></i>
              </el-col>
              <el-col :span="16">
                &nbsp;
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                接收平台打款的银行名称
              </el-col>
              <el-col :span="2">
                <i class="el-icon-circle-check" v-if="hasBankName"></i>
                <i class="el-icon-close" v-else></i>
              </el-col>
              <el-col :span="16">
                &nbsp;
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                接收平台打款的银行卡号
              </el-col>
              <el-col :span="2">
                <i class="el-icon-circle-check" v-if="hasBankAccountNo"></i>
                <i class="el-icon-close" v-else></i>
              </el-col>
              <el-col :span="16">
                &nbsp;
              </el-col>
            </el-row>
            
          </div>
        </el-collapse-item>
        <el-collapse-item title="商家权限等级">
          <div>
            <el-row>
              <el-col :span="6">
                平台提现手续费率
              </el-col>
              <el-col :span="2">
                {{accountProfile.charge_permillage}}
              </el-col>
              <el-col :span="16">
                千分之比
              </el-col>
            </el-row>
            
            <el-row>
              <el-col :span="6">
                每日提现次数
              </el-col>
              <el-col :span="2">
                5
              </el-col>
              <el-col :span="16">
                次
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>

    <el-row>
      <div>&nbsp;</div>
    </el-row>

    <el-row>
      <el-col :span="20">
        <el-row>
          <el-col :span="4">
            <el-tooltip content="该微信帐号用于接收平台所有打款" placement="top">
              <el-button type="primary" @click="onBindWechat">{{notify ? "设置": "修改"}}商家用户微信</el-button>
            </el-tooltip>
            </el-col>
          <el-col :span="4">
            <el-button @click="onBindBank">设置接收转账银行卡</el-button>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="4">
        <el-tooltip content="提取营业账户余额到商家设置的微信中" placement="top">
        <el-button type="danger" @click="onWithdraw">提取营业账户余额</el-button>
        </el-tooltip>
      </el-col>
    </el-row>

    <el-row>
    <el-dialog
      :close-on-click-modal="false"
      title="请用微信扫描下面二维码"
      :visible.sync="qrcodeDialogVisible"
      width="400px">
      <el-row v-loading="imageLoading">
        <span>请使用本人微信支付 1.00 元，后续平台打款将转账至该微信帐号</span>
        <img :src="qrcodeUrl" width="260rpx" height="260rpx" v-if="!imageLoading" />
      </el-row>
      <el-row type="flex" justify="end">
        <el-button @click="qrcodeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onBindFinish">完 成</el-button>
      </el-row>
    </el-dialog>
    </el-row>

    <!-- 提现dialog -->
    <el-row>
      <el-dialog
        :close-on-click-modal="false"
        title="账户余额提现"
        :visible.sync="withdrawDialogVisible"
        width="520px"
        >
        <el-row>
          <el-alert
            :title="withdrawTip"
            type="warning"
            show-icon>
          </el-alert>
        </el-row>
        <el-form label-position="top" label-width="100px">
          <el-row>
            <el-col :span="15">
              <el-form-item label="提取金额(元)">
                <el-input-number v-model.number="withdrawMoneyYuan" :disabled="doing"
                controls-position="right" :min="1" :max="18000" :step="100" style="width:100%"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="8">
              <el-form-item label="实际到账(元)">
                <span class="final-money-text">{{finalMoneyYuan}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          <el-form-item label="">
            <el-col :span="17">
            <el-radio-group v-model="withdrawType">
              <el-radio-button :label="1">转账到我的微信</el-radio-button>
              <el-radio-button :label="2" disabled>转账到我的银行卡</el-radio-button>
            </el-radio-group>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="6">
              <span class="nick-name-text">微信：{{nickName}}</span>
            </el-col>
          </el-form-item>
          </el-row>
          <el-form-item >
            <el-row>
            <el-col :span="15">
            <el-input placeholder="短信验证" v-model="smsCode" auto-complete="off"></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="8">
            <el-button :disabled="disabled" @click="getCode" class="code-btn" style="width:100%">{{btnText}}</el-button>
            </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onWithdrawCancle">取 消</el-button>
          <el-button type="danger" @click="onWithdrawSubmit" :loading="doing" :disabled="doing">确认提现</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import accountService from "@/api/merchant-account-service.js";
import withdrawService from "@/api/merchant-withdraw-service.js";
import wechatUserService from "@/api/wechat-user-service.js";
import systemService from "@/api/system-service.js";
import PanelGroup from "./widget/PanelGroup";
import { mapGetters } from "vuex";

export default {
  components: {
    PanelGroup
  },
  computed: {
    ...mapGetters(["user"]),
    hasUser: function() {
      return !this.user || !this.user.unid;
    },
    mobileShow: function() {
      let mobile = this.user.mobile;
      return mobile;
    }

  },
  watch: {
    withdrawMoneyYuan: function(val) {
      let m = 1.0 * val * (1000 - this.accountProfile.charge_permillage) / 1000;
      this.finalMoneyYuan = Math.floor(m * 100) / 100;
    }
  },
  data() {
    return {
      finalMoneyYuan: 1,
      withdrawMoneyYuan: 2,
      smsCode: null,
      withdrawDialogVisible: false,
      withdrawTip: "",
      withdrawType: 1,
      rules: {
        code: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 6,
            message: "验证码为6位数字",
            trigger: "blur"
          }
        ]
      },
      doing: false,

      qrcodeDialogVisible: false,
      qrcodeUrl: "",
      imageLoading: false,
      accountProfile: {},
      accountCash: {},
      accountMoney: {
        sale_total: 0,
        deposit_total: 0
      },

      notify: false,
      hasWechatOpenid: false,
      nickName: "",
      hasRealName: false,
      hasBankName: false,
      hasBankAccountNo: false,

      btnText: "获取验证码",
      currentTime: 60,
      disabled: false
    };
  },
  created() {
    // console.log("PersonSetting");
    if (!this.user || !this.user.id) {
      this.$store.dispatch("GetInfo");
    }
  },
  methods: {
    handleSetLineChartData(type) {
      console.log("type", type);
    },

    onBindWechat() {
      this.qrcodeDialogVisible = true;
      this.imageLoading = true;
      const that = this;
      let params = {
        total_fee: 100,
        merchant_unid: that.user.unid
      };
      accountService
        .createBindRecord(params)
        .then(res => {
          console.log("bind result", res);
          that.qrcodeUrl = res.data.url;
          that.imageLoading = false;
        })
        .catch(err => {
          console.log("bind error", err);
          that.qrcodeDialogVisible = false;
          that.imageLoading = false;
          that.$message.error(err);
        });
    },
    onBindBank() {
      this.$notify.warning("抱歉，银行提现功能正在维护中...");
    },
    onBindFinish() {
      this.qrcodeDialogVisible = false;
      this.fetchData();
    },
    onWithdraw() {
      let money = this.accountCash.sale_rmb_fen / 100;
      let rate = this.accountProfile.charge_permillage * 1.0 / 10;
      this.withdrawMoneyYuan = money / 2; // 默认提一半
      if (this.withdrawMoneyYuan < 5) {
        this.withdrawMoneyYuan = money;
      }
      this.withdrawTip =
        "您的提现手续费为 " + rate + "%, 当前最多可以提现 " + money + " 元";
      this.withdrawDialogVisible = true;
    },
    onWithdrawCancle() {
      this.withdrawDialogVisible = false;
      that.withdrawMoneyYuan = 1;
      that.smsCode = "";
    },
    onWithdrawSubmit() {
      if (!this.smsCode || this.smsCode.length !== 6) {
        this.$notify.warning("请正确输入6位数字的短信验证码");
        return;
      }

      let maxMoneyFen = this.accountCash.sale_rmb_fen;
      if (this.withdrawMoneyYuan * 100 > maxMoneyFen) {
        this.$notify.warning(this.withdrawTip);
        return;
      }

      if (this.finalMoneyYuan < 2) {
        this.$notify.warning("扣除手续费后不足2元，微信无法转账");
        return;
      }

      this.submitWithdraw();
    },
    submitWithdraw: function() {
      let form = {
        merchant_unid: this.user.unid,
        withdraw_money_fen: this.withdrawMoneyYuan * 100,
        code: this.smsCode
      };
      let that = this;
      that.doing = true;
      that.disabled = true;
      withdrawService
        .create(form)
        .then(res => {
          console.log("withdraw create res", res);
          that.fetchData();
          that.withdrawMoneyYuan = 1;
          that.smsCode = "";

          that.withdrawDialogVisible = false;
          // that.$message.success(
          //   "您的余额提取申请已提交成功，系统正在为您办理！"
          // );
          that.$message({
            showClose: true,
            message:
              "您的余额提取申请已提交成功，系统正在为您火速办理，请您注意查看通知.",
            type: "success",
            duration: 10000
          });
          that.doing = false;
          that.disabled = false;
        })
        .catch(err => {
          console.log("withdraw create err", err);
          that.$message.error(err);
          that.doing = false;
          that.disabled = false;
        });
    },
    // 获取验证码
    getCode() {
      var that = this;
      // 获取短信验证码
      that.smsCode = "";

      systemService
        .getAccountWithdrawCode(this.user.mobile)
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
    },
    getAccountCash() {
      const that = this;
      let unid = that.user.unid;
      accountService
        .getAccountCash(unid)
        .then(res => {
          // console.log("getAccountCash res", res);
          let accountCash = res.data;
          let accountMoney = {
            sale_total: accountCash.sale_rmb_fen * 1.0 / 100,
            deposit_total: accountCash.deposit_rmb_fen / 100
          };
          that.accountMoney = accountMoney;
          that.accountCash = accountCash;
          let money = this.accountCash.sale_rmb_fen * 1.0 / 100;
          that.withdrawTip = "当前最多可以提现 " + money + " 元";
        })
        .catch(err => {
          console.log("getAccountCash err", err);
        });
    },
    getAccountProfile() {
      const that = this;
      let unid = that.user.unid;
      accountService
        .getAccountProfile(unid)
        .then(res => {
          // console.log("getAccountProfile res", res);
          that.accountProfile = res.data;
          let openid = that.accountProfile.wechat_openid;
          if (!openid || openid.length < 1) {
            that.notify = true;
            that.hasWechatOpenid = false;
            that.nickName = "";
          } else {
            that.notify = false;
            that.hasWechatOpenid = true;
            that.nickName = "**** ****";
            wechatUserService
              .get(openid)
              .then(res2 => {
                that.nickName = that.formatNickName(res2.data.nickName);
              })
              .catch(err2 => {
                console.log("get wechatUser error", err2);
              });
          }
        })
        .catch(err => {
          console.log("getAccountProfile err", err);
        });
    },
    formatNickName(name) {
      let len = name.length;
      if (len < 3) {
        return name;
      }
      return "****" + name.substring(len - 2);
    },
    fetchData() {
      this.getAccountCash();
      this.getAccountProfile();
    },
    delayFetchData() {
      const that = this;
      if (that.user && that.user.unid) {
        that.fetchData();
        return;
      }
      let i = 0;
      let handler = setInterval(function() {
        if (i++ > 2) {
          clearInterval(handler);
        }
        console.log("delayFetchData");
        if (!that.user || !that.user.unid) {
          return;
        }
        that.fetchData();
        clearInterval(handler);
      }, 800);
    }
  },
  created() {
    // console.log("StoreIndex", this.firm);
    if (!this.user || !this.user.id) {
      this.$store.dispatch("GetInfo");
    }
    this.delayFetchData();
  }
};
</script>

<style scoped>
.nick-name-text {
  font-weight: 400;
  color: #9a9a9a;
}
.final-money-text {
  font-weight: 400;
  font-size: 28px;
  color: red;
  align-self:flex-end;
}
</style>

