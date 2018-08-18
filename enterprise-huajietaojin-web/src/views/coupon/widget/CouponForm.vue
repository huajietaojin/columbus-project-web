<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="所属门店" prop="store_id">
        <el-select v-model="form.store_id" filterable clearable placeholder="选择门店" style="width: 100%;" :disabled="!editable">
            <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="现金券类型" prop="type">
          <el-radio-group v-model="form.type" :disabled="!editableType">
            <el-radio v-for="item in types" :key="item.code" :label="item.code" :value="item.code">{{item.name}}</el-radio>
          </el-radio-group>
          <span class="tip-text">现金券类型一旦设置将不能修改</span>
      </el-form-item>

      <el-form-item v-if="form.type === 1" label="现金券金额" required>
        <el-input-number v-model.number="money" :min="1" :max="99999999" :step="10" label="现金券金额" :disabled="!editable"></el-input-number>
        <span class="tip-text">现金券金额，单位元，最低1元，可以手动输入</span>
      </el-form-item>
      <el-form-item v-if="form.type === 2" label="现金券折扣" required>
        <el-input-number v-model.number="discount" :min="1" :max="9.9" :step="0.1" label="现金券折扣" :disabled="!editable"></el-input-number>
        <span class="tip-text">现金券折扣，最低1折，可以手动输入</span>
      </el-form-item>

      <!-- <el-form-item label="金额/折扣" prop="content">
        <el-input v-model.number="form.content" :disabled="!editable"></el-input>
      </el-form-item> -->

      <el-form-item label="最低消费金额" prop="base_price">
        <el-input-number v-model.number="form.base_price" :min="5" :max="99999999" :step="10" label="最低消费金额" :disabled="!editable"></el-input-number>
        <span class="tip-text">最低消费金额指明满足多少后可以使用该券, 单位元</span>
      </el-form-item>

      <el-form-item label="微信转发标题" prop="retweet_title">
        <el-input v-model="form.retweet_title" :disabled="!editable"></el-input>
      </el-form-item>
      
      <el-form-item label="微信转发背景图" prop="picture">
        <aliyun-uploader 
          :disabled="!editable"
          :limit="onlyOne"
          :prefix="couponPrefix"
          :file-list="pictureList"
          @on-remove="handleRemove"
          @on-success="handleSuccess"
          @on-error="handleError">
        <i class="el-icon-plus"></i>
        </aliyun-uploader>
        <span class="tip-color">限传1张, 展示图尺寸长宽500*400或5:4比例最佳</span>
      </el-form-item>

      <el-form-item label="是否强制分享">
        <el-switch v-model="form.force_share" :disabled="!editable"></el-switch>
        <span class="tip-text">开启强制分享后，消费者必须通过微信分享给若干好友后才能使用本现金券</span>
      </el-form-item>

      <el-form-item label="微信转发人数" prop="require_retweets" v-if="form.force_share">
        <el-input-number v-model.number="form.require_retweets" :min="1" :max="50" label="微信转发人数" :disabled="!editable"></el-input-number>
      </el-form-item>

      <el-form-item label="适用门店" prop="effect_stores">
       <el-checkbox-group v-model="effectStoreIdList" >
        <el-checkbox-button v-for="item in stores" :key="item.id" :label="item.id" :value="item.id">{{item.name}}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="有效日期" required>
        <el-col :span="7">
          <el-form-item prop="start_at">
          <el-date-picker type="datetime" placeholder="选择开始日期" v-model="form.start_at" :disabled="!editable" :editable="false" style="width: 100%;" default-time="23:00:00" 
          format="yyyy年MM月dd日 HH时mm分ss秒"
          value-format="timestamp"
          ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="7">
          <el-form-item prop="expire_at">
          <el-date-picker type="datetime" placeholder="选择截至日期" v-model="form.expire_at" :disabled="!editable" :editable="false" style="width: 100%;" default-time="23:00:00" 
          format="yyyy年MM月dd日 HH时mm分ss秒"
          value-format="timestamp"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>

      <!-- <el-form-item label="使用规则" prop="effect_rule_values">
        <el-input v-model="form.effect_rule_values" :disabled="!editable" type="textarea" :autosize="{ minRows: 4, maxRows: 30}"></el-input>
      </el-form-item> -->

      <el-form-item
        v-for="(item, index) in effectRuleList"
        :label="'使用规则' + (index + 1)"
        :key="item.id"
        required
      >
        <el-col :span="21">
          <el-input v-model="item.value" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" maxlength="128" :disabled="!editable"></el-input>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="2">
          <el-button @click.prevent="removeDomain(item)" :disabled="!editable">删除</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <span class="tip-text">现金券使用规则每个输入框限写一条规则，每条规则允许输入128个字符，点击 `教我设置` 按钮导入模板规则</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain" :disabled="!editable" round>新增规则</el-button>
        <el-button @click="addDefault" :disabled="!editable" round>教我设置</el-button>
      </el-form-item>

      <el-form-item v-if="!editable" label="是否发行">
        <el-switch v-model="form.enable" :disabled="true"></el-switch>
      </el-form-item>

      <el-form-item label="现金券介绍" prop="intro">
        <el-input v-model="form.intro" type="textarea" rows="4" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item v-if="!editable" label="创建时间">
        <el-input v-model="createTime" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item v-if="!editable" label="修改时间">
        <el-input v-model="updateTime" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item v-if="editable">
        <el-button type="primary" @click="onSubmit" :loading="loading" :disabled="loading">提 交</el-button>
        <el-button @click="onCancel">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AliyunUploader from "@/components/AliyunUploader";
import { parseTime } from "@/utils";

const templateRules = [
  { id: 1, value: "优惠券直接抵扣现金使用，使用前需要满足使用条件" },
  { id: 2, value: "优惠券不找零，不兑换现金" },
  { id: 3, value: "请在结账时出示优惠券使用后的优惠价格计算结果页面" },
  { id: 4, value: "优惠券只能在适用范围内使用，不适用的范围具体如下。。。" },
  {
    id: 5,
    value:
      "用了优惠券的商品发生退货退款时，退款金额上限为顾客实际支付给本公司的金额，优惠券不可退换"
  },
  {
    id: 6,
    value: "使用优惠券折扣的商品，本公司根据折扣后顾客实际支付的金额开具发票"
  },
  {
    id: 7,
    value: "部分品牌的商品无法使用优惠券，敬请谅解，具体商品如下。。。"
  },
  { id: 8, value: "本公司保留最终解释权" }
];

export default {
  components: { AliyunUploader },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    coupon: {
      type: Object
    },
    stores: {
      typse: Array
    }
  },
  computed: {
    createTime: function() {
      if (!this.form.create_at) {
        return "";
      }
      return parseTime(this.form.create_at);
    },
    updateTime: function() {
      if (!this.form.update_at) {
        return "";
      }
      return parseTime(this.form.update_at);
    }
  },
  watch: {
    coupon: function(val) {
      this.form = val;
      if (!this.init && this.form) {
        this.init = true;
        if (this.form.picture) {
          this.pictureList.push({ name: "picture", url: this.form.picture });
        }

        this.editableType = false;
        if (this.form.type === 1) {
          this.money = this.form.content;
        } else {
          this.discount = this.form.content;
        }

        this.effectStoreIdList = [];
        if (this.form.effect_stores) {
          let arr = this.form.effect_stores.split(",");
          for (let v of arr) {
            // this.effect_stores[i] = parseInt(arr[i]);
            this.effectStoreIdList.push(parseInt(v));
          }
        }

        this.effectRuleList = [];
        if (this.form.effect_rule_values) {
          let rules = this.form.effect_rule_values;
          for (let i in rules) {
            // this.effect_stores[i] = parseInt(arr[i]);
            this.effectRuleList.push({ id: i, value: rules[i] });
          }
        }
      }
    }
  },
  data() {
    let checkPicture = (rule, value, callback) => {
      if (this.form.picture === "") {
        callback(new Error("请上传图片"));
      } else {
        callback();
      }
    };
    let checkStores = (rule, value, callback) => {
      if (this.effectStoreIdList.length < 1) {
        callback(new Error("请至少选择一个适用门店"));
      } else {
        callback();
      }
    };
    return {
      init: false,
      types: [{ code: 1, name: "现金抵扣券" }, { code: 2, name: "打折券" }],
      onlyOne: 1,
      pictureList: [],
      couponPrefix: "coupon/picture/",
      effectStoreIdList: [],
      effectRuleList: [{ id: 0, value: "" }],
      checkRuleValueList: [
        { required: true, message: "规则内容不能为空", trigger: "blur" },
        {
          min: 3,
          max: 400,
          message: "单条规则长度在 3 到 400 个字符",
          trigger: "blur"
        }
      ],

      money: 10,
      discount: 8.5,
      editableType: true,
      form: {
        store_id: null,
        retweet_title: "",
        require_retweets: 1,
        type: 1,
        content: "",
        base_price: 100,
        intro: "",
        picture: "",
        enable: false,
        start_at: null,
        expire_at: null,
        effect_rule_values: "",
        effect_stores: "",
        force_share: false
      },
      rules: {
        start_at: [
          {
            required: true,
            message: "请选择开始日期",
            trigger: "change"
          }
        ],
        expire_at: [
          {
            required: true,
            message: "请选择截至日期",
            trigger: "change"
          }
        ],
        picture: [{ required: true, validator: checkPicture, trigger: "blur" }],
        store_id: [
          { required: true, message: "请选择所属门店", trigger: "blur" }
        ],
        effect_stores: [
          { required: true, validator: checkStores, trigger: "change" }
        ],
        retweet_title: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 120,
            message: "长度在 3 到 120 个字符",
            trigger: "blur"
          }
        ],
        require_retweets: [
          { required: true, message: "请输入人数", trigger: "blur" },
          { type: "number", message: "人数必须为数字值" }
        ],
        intro: [
          {
            min: 3,
            max: 120,
            message: "长度在 3 到 120 个字符",
            trigger: "blur"
          }
        ],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        content: [
          { required: true, message: "请输入折扣或金额", trigger: "blur" },
          { type: "number", message: "折扣或金额必须为数字值" }
        ],
        base_price: [
          { required: true, message: "请输入最低消费金额", trigger: "blur" },
          { type: "number", message: "最低消费金额必须为数字值" }
        ]
      }
    };
  },
  methods: {
    removeDomain(item) {
      if (this.effectRuleList.length < 2) {
        this.$message.error("至少保留一条规则");
        return;
      }
      var index = this.effectRuleList.indexOf(item);
      if (index !== -1) {
        this.effectRuleList.splice(index, 1);
      }
    },
    addDomain() {
      let id = new Date().getTime();
      this.effectRuleList.push({
        value: "",
        id: id
      });
    },
    addDefault() {
      let time = new Date().getTime();
      for (let item of templateRules) {
        this.effectRuleList.push({
          value: item.value,
          id: time + item.id
        });
      }
    },
    onSubmit() {
      // this.$message('submit!');
      const that = this;
      this.$refs["form"].validate(valid => {
        if (valid === true) {
          if (that.form.type === 1) {
            that.form.content = this.money;
          } else {
            that.form.content = this.discount;
          }
          that.form.effect_stores = that.effectStoreIdList.join(",");
          that.form.effect_rule_values = that.combieRules();
          that.$emit("submit", that.form);
        } else {
          that.$message({
            message: "请填写正确表单",
            type: "warning"
          });
        }
      });
    },
    combieRules() {
      let values = [];
      for (let item of this.effectRuleList) {
        if (!item.value || item.value.length < 1) {
          continue;
        }
        values.push(item.value);
      }
      return values;
    },
    onCancel() {
      this.$router.push({ name: "CouponIndex" });
    },
    handleRemove(file, fileList) {
      console.log("handleRemove", file, fileList);
      this.form.picture = "";
    },
    handleSuccess(url, file) {
      console.log("handleSuccess", url, file);
      this.form.picture = url;
    },
    handleError(err, file) {
      console.log("handleError", err, file);
      this.form.picture = "";
    }
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>