<template>
  <div>
    <el-upload action="https://huajietaojin.oss-cn-hangzhou.aliyuncs.com" 
          list-type="picture-card" 
          :disabled="disabled"
          :limit="limit"
          :file-list="fileList"
          :http-request="handleUpload"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview" 
          :on-remove="handleRemove"
          :on-error="handleError"
          :on-exceed="handelExceed">
        <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
  </div>  
</template>

<script>
import aliyunService from "@/api/aliyun-service.js";

export default {
  props: {
    prefix: {
      type: String,
      default: "prefix"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    fileList: {
      type: Array
    },
    fileMb: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      dialogImageUrl: "", // 预览原图
      dialogVisible: false,
      ossToken: {},
      acceptTypes: ["jpg", "png", "jpeg"]
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      let name = file.name;

      //取出上传文件的扩展名
      let flag = false;
      let len = name.lastIndexOf(".");
      let ext = name.substr(len + 1).toLowerCase();;
      //循环比较
      for (let t of this.acceptTypes) {
        if (ext === t) {
          flag = true; //一旦找到合适的，立即退出循环
          break;
        }
      }
      if (!flag) {
        this.$message.error("只能上传 jpg/png 格式图片");
        return false;
      }

      let isOverSize = file.size / 1024 / 1024 > this.fileMb;

      if (isOverSize) {
        this.$message.error("大小不能超过 " + this.fileMb + " MB");
      }
      return !isOverSize;
    },
    handleRemove(file, fileList) {
      // console.log('handleRemove', file, fileList);
      this.$emit("on-remove", file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleError(err, file, fileList) {
      // console.log('handleError', err, file, fileList);
      this.$emit("on-error", err, file);
    },
    handelExceed(files, fileList) {
      // console.log('handelExceed', files, fileList);
      this.$message({
        message: "只允许上传" + this.limit + "张图片",
        type: "warning"
      });
    },
    handleUpload(params) {
      // console.log('begin upload', params);
      const that = this;
      return aliyunService
        .upload(params.file, this.ossToken, this.prefix)
        .then(url => {
          that.$emit("on-success", url, params.file);
        })
        .catch(err => {
          that.$emit("on-error", err, params.file);
        });
    }
  },
  created() {
    const that = this;
    aliyunService
      .getSignature()
      .then(response => {
        that.ossToken = response.data;
      })
      .catch();
  }
};
</script>
      