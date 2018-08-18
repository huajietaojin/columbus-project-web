<template>
  <div>
    <el-upload action="https://huajietaojin.oss-cn-hangzhou.aliyuncs.com" 
          :disabled="disabled"
          :limit="limit"
          :file-list="fileList"
          :http-request="handleUpload"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview" 
          :on-remove="handleRemove"
          :on-error="handleError"
          :on-exceed="handelExceed"
          :on-progress="handleProgress">
        <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
       <el-progress v-show="showProgress" :text-inside="true" :stroke-width="16" :percentage="uploadPercent"></el-progress>
        <!-- <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
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
      default: 50
    }
  },
  data() {
    return {
      dialogImageUrl: "", // 预览原图
      dialogVisible: false,
      ossToken: {},
      uploadPercent: 0,
      showProgress: false,
      xhr: new XMLHttpRequest()
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      let name = file.name;
      let mp4 = name.substring(name.length - 3, name.length).toLowerCase();
      let isMp4 = mp4 === "mp4";
      if (!isMp4) {
        this.$message.error("只能上传 mp4 格式视频");
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
      this.showProgress = false;
      this.uploadPercent = 0;
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
        message: "只允许上传" + this.limit + "个文件",
        type: "warning"
      });
    },
    handleProgress(event, file, fileList) {
      console.log("handleProgress", event, file, fileList);
    },
    handleUpload(params) {
      // console.log('begin upload', params);
      const that = this;
      // return aliyunService
      //   .upload(params.file, this.ossToken, this.prefix)
      //   .then(url => {
      //     that.$emit("on-success", url, params.file);
      //   })
      //   .catch(err => {
      //     that.$emit("on-error", err, params.file);
      //   });
      let file = params.file;
      let ossToken = this.ossToken;
      let formData = new FormData(); // 创建form对象
      let key = aliyunService.getKey(file, ossToken, this.prefix);
      formData.append("key", key);
      formData.append("OSSAccessKeyId", ossToken.accessid);
      formData.append("policy", ossToken.policy);
      formData.append("signature", ossToken.signature);
      formData.append("success_action_status", "200");
      formData.append("file", file);

      let finalUrl = ossToken.host + "/" + key;

      this.xhr.open("post", ossToken.host, true);
      this.xhr.upload.addEventListener(
        "progress",
        this.progressFunction,
        false
      ); //调用方法监听上传进度
      this.xhr.send(formData);
      this.xhr.onload = res => {
        this.$message({
          type: "success",
          message: "上传完成"
        });
        console.log("onload", finalUrl, res);
        that.$emit("on-success", finalUrl, file);
      };
    },
    progressFunction(event) {
      // console.log('progressFunction', event)
      // 设置进度显示
      if (event.lengthComputable) {
        var percent = Math.floor(event.loaded / event.total * 100);
        if (percent > 100) {
          percent = 100;
        }
        this.uploadPercent = percent;
      }
      this.showProgress = true;
    },
    refUpload() {
      //关闭上传事件
      this.xhr.abort();
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
      