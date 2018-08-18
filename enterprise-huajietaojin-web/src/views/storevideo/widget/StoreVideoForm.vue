<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="所属门店" prop="store_id">
        <el-select v-model="form.store_id" :loading="fetching" filterable clearable placeholder="选择门店" style="width: 100%;" :disabled="!editable">
            <el-option v-for="item in stores" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="视频名称" prop="name">
        <el-input v-model="form.name" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item label="视频封面" prop="cover">
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

      <el-form-item label="上传方式">
          <el-radio-group v-model="uploadType" :disabled="!editable || form.id > 0">
            <el-radio v-for="item in types" :key="item.code" :label="item.code" :value="item.code">{{item.name}}</el-radio>
          </el-radio-group>
          <span class="tip-text">视频上传后将不能修改，有新视频请重新添加</span>
      </el-form-item>

      <el-form-item label="" v-if="uploadType == 2">
        <!-- <div class="el-upload el-upload--picture-card"><i class="el-icon-plus"></i></div> -->
        <video-uploader 
          :disabled="!editable || form.id > 0"
          :limit="onlyOne"
          :prefix="videoPrefix"
          @on-remove="handleRemoveVideo"
          @on-success="handleSuccessVideo"
          @on-error="handleErrorVideo">
        </video-uploader>
      </el-form-item>

      <el-form-item label="视频地址" prop="video_url">
        <el-input v-model="form.video_url" :disabled="!editable || uploadType != 1  || form.id > 0" type="textarea" :rows="2"></el-input>
      </el-form-item>

      <el-form-item label="简介" prop="intro">
        <el-input v-model="form.intro" :disabled="!editable" type="textarea" :rows="3"></el-input>
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
import VideoUploader from "@/components/VideoUploader";
import { parseTime } from "@/utils";

export default {
  components: { AliyunUploader, VideoUploader },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    storeVideo: {
      type: Object
    },
    fetching: {
      type: Boolean,
      default: false
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
    storeVideo: function(val) {
      this.form = val;
      if (!this.init && this.form) {
        console.log("video watch init", val);
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
    return {
      types: [{ code: 1, name: "填入视频地址" }, { code: 2, name: "本地上传视频" }],
      uploadType: 1,
      init: false,
      coverList: [],
      onlyOne: 1,
      videoPrefix: "video/mp4/",
      coverPrefix: "video/cover/",
      form: {
        store_id: null,
        intro: "",
        cover_picture: "",
        video_url: "",
        enable: false,
        name: "",
      },
      rules: {
        store_id: [{ required: true, message: "请选择门店", trigger: "blur" }],
        cover: [{ required: true, validator: checkCover, trigger: "blur" }],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 120,
            message: "长度在 3 到 120 个字符",
            trigger: "blur"
          }
        ],
        video_url: [
          { required: true, message: "请输入视频地址", trigger: "blur" },
          {
            min: 1,
            max: 512,
            message: "长度在 1 到 512 个字符",
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
      this.$router.push({ name: "StoreVideoIndex" });
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

    handleRemoveVideo(file, fileList) {
      console.log("handleRemoveVideo", file, fileList);
      this.form.video_url = "";
    },
    handleSuccessVideo(url, file) {
      console.log("handleSuccessVideo", url, file);
      this.form.video_url = url;
    },
    handleErrorVideo(err, file) {
      console.log("handleErrorVideo", err, file);
      this.form.video_url = "";
    },
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>