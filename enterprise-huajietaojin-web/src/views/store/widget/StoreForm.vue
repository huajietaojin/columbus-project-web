<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="店铺名称" prop="name">
        <el-input v-model="form.name" :disabled="!editableName"></el-input>
        <span class="tip-color">店铺名称一旦设置将不能修改，建议结合自身品牌填写简短好记的名称</span>
      </el-form-item>

      <el-form-item v-if="!editable" label="卡券发行能力" required>
        <span style="color:blue">可以同时发行 {{form.coupon_limit}} 个</span>
        <span class="tip-text">卡券发行能力指同时处于发行状态的卡券数目限制，卡券添加不受限制</span>
      </el-form-item>

      <el-form-item label="店铺Logo" prop="logo">
        <aliyun-uploader
          :disabled="!editable"
          :limit="onlyOne"
          :prefix="logoPrefix"
          :file-list="logoList"
          :file-mb="0.5"
          @on-remove="handleRemoveLogo"
          @on-success="handleSuccessLogo"
          @on-error="handleErrorLogo">
        <i class="el-icon-plus"></i>
        </aliyun-uploader> <span class="tip-color">限传1张，Logo尺寸长宽200*200最佳，大小不能超过0.5MB</span>
      </el-form-item>

      <el-form-item label="商家类型" prop="category_id">
        <el-select v-model="form.category_id" placeholder="请选择标签类型" :disabled="!editable">
          <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="封面标题" prop="cover_title">
        <el-input v-model="form.cover_title" :disabled="!editable"></el-input>
        <span class="tip-text">封面标题用在微信转发时的描述性文字</span>
      </el-form-item>
      
      <el-form-item label="封面图片" prop="cover">
        <aliyun-uploader 
          :disabled="!editable"
          :limit="onlyOne"
          :prefix="coverPrefix"
          :file-list="coverList"
          @on-remove="handleRemoveCover"
          @on-success="handleSuccessCover"
          @on-error="handleErrorCover">
        <i class="el-icon-plus"></i>
        </aliyun-uploader>
        <span class="tip-color">限传1张，封面图片用在微信转发时的背景图片，尺寸长宽300*300或1:1比例最佳</span>
      </el-form-item>

      <el-form-item label="门店地址" prop="address">
        <el-input v-model="form.address" type="textarea" :rows="2" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="form.contact" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item label="展示图片" prop="show">
        <aliyun-uploader
          :disabled="!editable"
          :prefix="showPrefix"
          :limit="onlyNine"
          :file-list="showList"
          @on-remove="handleRemoveShow"
          @on-success="handleSuccessShow"
          @on-error="handleErrorShow">
        <i class="el-icon-plus"></i>
        </aliyun-uploader>
        <span class="tip-color">限传9张，展示图片尺寸长宽750*400最佳</span>
      </el-form-item>
      
      <el-form-item label="是否有商品展示">
        <el-switch v-model="form.show_product" :disabled="!editable"></el-switch>
        <span class="tip-text">若启用了商品展示功能，请到商品模块管理商品，商品上架后即可被用户查看</span>
      </el-form-item>

      <el-form-item label="门店简介" prop="intro">
        <el-input v-model="form.intro" :disabled="!editable" type="textarea" :rows="4"></el-input>
      </el-form-item>

      <el-form-item v-if="!editable" label="是否启用">
        <el-switch v-model="form.enable" :disabled="true"></el-switch>
      </el-form-item>

      <el-form-item v-if="!editable" label="创建时间">
        <el-input v-model="createTime" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item v-if="!editable" label="修改时间">
        <el-input v-model="updateTime" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item v-if="editable" >
        <el-button type="primary" @click="onSubmit" v-if="!notify" :loading="loading" :disabled="loading">提 交</el-button>
        <el-button @click="onCancel">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AliyunUploader from "@/components/AliyunUploader";
import { parseTime } from "@/utils";

const categorys = [
  { id: 1, name: "美食" },
  { id: 2, name: "服饰" },
  { id: 3, name: "娱乐" },
  { id: 4, name: "服务" }
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
    notify: {
      type: Boolean,
      default: false
    },
    store: {
      type: Object
    },
    firm: {
      type: Object
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
    store: function(val) {
      console.log("watch store", val);
      this.form = val;

      if (this.form.name && this.form.name.length > 2) {
        this.editableName = false
      }

      if (!this.initImage && this.form) {
        this.initImage = true;
        this.logoList = [];
        if (this.form.logo) {
          this.logoList.push({ name: "logo", url: this.form.logo });
        }

        this.coverList = [];
        if (this.form.cover_picture) {
          this.coverList.push({ name: "cover", url: this.form.cover_picture });
        }

        this.showList = [];
        if (this.form.show_pictures) {
          let arr = this.form.show_pictures;
          for (let i in arr) {
            this.showList.push({ name: "show" + i, url: arr[i] });
          }
        }
      }
    }
  },
  data() {
    let checkLogo = (rule, value, callback) => {
      if (this.form.logo === "") {
        callback(new Error("请上传Logo图片"));
      } else {
        callback();
      }
    };
    let checkCover = (rule, value, callback) => {
      if (this.form.cover_picture === "") {
        callback(new Error("请上传封面图片"));
      } else {
        callback();
      }
    };
    let checkShow = (rule, value, callback) => {
      if (this.showList.length < 1) {
        callback(new Error("请上传展示图片"));
      } else {
        callback();
      }
    };
    return {
      categorys: categorys,
      logoList: [],
      coverList: [],
      onlyNine: 9,
      onlyOne: 1,
      showList: [],

      initImage: false,
      logoPrefix: "store/logo/",
      coverPrefix: "store/cover/",
      showPrefix: "store/show/",

      hasModifyShow: false,
      
      editableName: true,
      form: {
        name: "",
        logo: "",
        cover_picture: "",
        cover_title: "",
        address: "",
        contact: "",
        category_id: null,
        enable: false,
        show_product: false,
        firm_id: null,
        longitude: "",
        latitude: "",
        type: 1,
        intro: "",
        pictures: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ],
        cover_title: [
          { required: true, message: "请输入封面标题", trigger: "blur" },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur"
          }
        ],
        category_id: [{ required: true, message: "请选择", trigger: "blur" }],
        logo: [{ required: true, validator: checkLogo, trigger: "blur" }],
        cover: [{ required: true, validator: checkCover, trigger: "blur" }],
        show: [{ required: true, validator: checkShow, trigger: "blur" }],
        address: [
          { required: true, message: "请输入门店地址", trigger: "blur" },
          {
            min: 1,
            max: 512,
            message: "长度在 1 到 512 个字符",
            trigger: "blur"
          }
        ],
        contact: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          {
            min: 1,
            max: 256,
            message: "长度在 1 到 256 个字符",
            trigger: "blur"
          }
        ],
        intro: [
          { required: true, message: "请输入简介", trigger: "blur" },
          {
            min: 1,
            max: 512,
            message: "长度在 1 到 512 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      // this.$message('submit!')
      const that = this;
      this.$refs["form"].validate(valid => {
        if (valid === true) {
          if (this.hasModifyShow) {
            this.form.show_pictures = this.combinePictures();
          } else {
            console.log("没有修改图片")
            this.form.show_pictures = [];
          }
          this.form.firm_id = this.firm.id;
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
      this.$router.push({ name: "StoreIndex" });
    },
    handleRemoveLogo(file, fileList) {
      console.log("handleRemoveLogo", file, fileList);
      this.form.logo = "";
    },
    handleSuccessLogo(url, file) {
      console.log("handleSuccessLogo", url, file);
      this.form.logo = url;
    },
    handleErrorLogo(err, file) {
      console.log("handleErrorLogo", err, file);
      this.form.logo = "";
    },

    handleRemoveCover(file, fileList) {
      console.log("handleRemoveCover", file, fileList);
      this.form.cover_picture = "";
    },
    handleSuccessCover(url, file) {
      console.log("handleSuccessCover", url, file);
      this.form.cover_picture = url;
    },
    handleErrorCover(err, file) {
      console.log("handleErrorCover", err, file);
      this.form.cover_picture = "";
    },

    handleRemoveShow(file, fileList) {
      console.log("handleRemoveShow", file, fileList);
      const showList = this.showList;
      const newList = [];
      for (const item of showList) {
        if (item.name === file.name) {
          continue;
        }
        newList.push({ name: item.url, url: item.url });
      }
      this.showList = newList;
      this.hasModifyShow = true;
    },
    handleSuccessShow(url, file) {
      console.log("handleSuccessShow", url, file);
      this.showList.push({ name: url, url: url });
      this.hasModifyShow = true;
    },
    handleErrorShow(err, file) {
      console.log("handleErrorShow", err, file);
    },
    combinePictures() {
      let res = [];
      let showList = this.showList;
      for (const item of showList) {
        res.push(item.url);
      }
      return res;
    }
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

