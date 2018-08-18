<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="所属门店" prop="store_id">
        <el-select v-model="form.store_id" filterable clearable placeholder="选择门店" style="width: 100%;" :disabled="!editable">
            <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" :disabled="!editable"></el-input>
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
        <span class="tip-color">限传1张，封面图片尺寸长宽750*400最佳</span>
      </el-form-item>

      <el-form-item label="简介" prop="intro">
        <el-input v-model="form.intro" :disabled="!editable" type="textarea" :rows="3"></el-input>
      </el-form-item>

      <el-form-item label="产品展示图" prop="show">
        <aliyun-uploader
          :disabled="!editable"
          :limit="onlyNine"
          :prefix="showPrefix"
          :file-list="showList"
          @on-remove="handleRemoveShow"
          @on-success="handleSuccessShow"
          @on-error="handleErrorShow">
        <i class="el-icon-plus"></i>
        </aliyun-uploader>
        <span class="tip-color">限传9张，产品展示图片尺寸长宽750*400最佳</span>
      </el-form-item>

      <el-form-item v-if="!editable" label="是否上架">
        <el-switch v-model="form.enable" :disabled="true"></el-switch>
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
    product: {
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
    product: function(val) {
      this.form = val;
      if (!this.init && this.form) {
        console.log("product watch init", val);
        this.init = true;
        this.showList = [];
        if (this.form.show_pictures) {
          let arr = this.form.show_pictures;
          for (let i in arr) {
            this.showList.push({ name: "show" + i, url: arr[i] });
          }
        }

        this.coverList = [];
        if (this.form.cover_picture) {
          this.coverList.push({ name: "cover", url: this.form.cover_picture });
        }
      }
    }
  },
  data() {
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
      init: false,
      coverList: [],
      onlyNine: 9,
      onlyOne: 1,
      showList: [],
      coverPrefix: "product/cover/",
      showPrefix: "product/show/",
      hasModifyShow: true,
      form: {
        store_id: null,
        intro: "",
        cover_picture: "",
        enable: false,
        name: "",
        show_pictures: []
      },
      rules: {
        store_id: [{ required: true, message: "请选择门店", trigger: "blur" }],
        cover: [{ required: true, validator: checkCover, trigger: "blur" }],
        show: [{ required: true, validator: checkShow, trigger: "blur" }],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 120,
            message: "长度在 3 到 120 个字符",
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
      const that = this;
      this.$refs["form"].validate(valid => {
        if (valid === true) {
          if (this.hasModifyShow) {
            this.form.show_pictures = this.combinePictures();
          } else {
            this.form.show_pictures = [];
          }
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
      this.$router.push({ name: "ProductIndex" });
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
</style>