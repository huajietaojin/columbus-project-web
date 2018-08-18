<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="企业名称" prop="legal_name">
        <el-input v-model="form.legal_name" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item label="统一社会信用代码" prop="license_code">
        <el-input v-model="form.license_code" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item label="法定代表人" prop="legal_person">
        <el-input v-model="form.legal_person" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item label="省份城市">
        <el-col :span="8">
          <el-select v-model="province_no" filterable clearable placeholder="筛选省份" style="width: 100%;" >
            <el-option v-for="item in provinces" :key="item.n" :label="item.m" :value="item.n">
              <span style="float: left">{{ item.m }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.n }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="7">
          <el-select v-model="city_no" filterable clearable placeholder="筛选城市" style="width: 100%;" >
            <el-option v-for="item in citys" :key="item.n" :label="item.m" :value="item.n">
              <span style="float: left">{{ item.m }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.n }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="7">
          <el-select v-model="region_no" filterable clearable placeholder="筛选区县" style="width: 100%;" >
            <el-option v-for="item in regions" :key="item.n" :label="item.m" :value="item.n">
              <span style="float: left">{{ item.m }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.n }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item label="登记地址" prop="legal_address">
        <el-input v-model="form.legal_address" type="textarea" :rows="3" :disabled="!editable"></el-input>
      </el-form-item>

      <el-form-item label="营业执照">
        <aliyun-uploader 
          :disabled="!editable"
          :file-list="license_picture_list"
          @on-remove="handleRemoveLogo"
          @on-success="handleSuccessLogo"
          @on-error="handleErrorLogo">
        <i class="el-icon-plus"></i>
        </aliyun-uploader>
      </el-form-item>

      <el-form-item label="启用">
        <el-switch v-model="form.enable" :disabled="!editable"></el-switch>
      </el-form-item>

      <el-form-item v-if="editable">
        <el-button type="primary" @click="onSubmit">提 交</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AliyunUploader from "@/components/AliyunUploader";
import chinaService from "@/api/china-service";

export default {
  components: { AliyunUploader },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    firm: {
      type: Object
    }
  },
  watch: {
    firm: function(val) {
      console.log("watch firm,", val);
      if (!val) {
        return;
      }
      this.form = val;
      this.province_no = val.province_no;
      this.city_no = val.city_no;
      this.region_no = val.region_no;

      if (this.form && this.form.license_picture) {
        this.license_picture_list.push({
          name: "license_picture",
          url: this.form.license_picture
        });
      }
    },
    province_no: function(pno, old) {
      console.log("watch province_no", pno, old);
      this.form.province_no = pno;
      if (pno === null || pno === "") {
        this.citys = chinaService.citys;
        this.city_no = null;
        return;
      }
      this.citys = chinaService.listCitys(pno);
      return;
    },
    city_no: function(cno, old) {
      console.log("watch city_no", cno, old);
      this.form.city_no = cno;
      if (cno === null || cno === "") {
        this.regions = [];
        this.region_no = null;
        return;
      }
      this.regions = chinaService.listRegions(cno);
    },
    region_no: function(rno) {
      this.form.region_no = rno;
    }
  },
  data() {
    return {
      provinces: chinaService.provinces,
      citys: chinaService.citys,
      regions: [],

      license_picture_list: [],
      limitSize: 5,
      existFileList: [],

      prefix: "dev",
      province_no: null,
      city_no: null,
      region_no: null,
      form: {
        legal_name: "",
        license_picture: "",
        license_code: "",
        legal_person: "",
        legal_address: "",
        enable: false,
        province_no: null,
        city_no: null,
        region_no: null
      },
      rules: {
        legal_name: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
          {
            min: 3,
            max: 120,
            message: "长度在 3 到 120 个字符",
            trigger: "blur"
          }
        ],
        license_code: [
          { required: true, message: "统一社会信用代码", trigger: "blur" },
          {
            min: 12,
            max: 20,
            message: "长度在 12 到 20 个字符",
            trigger: "blur"
          }
        ],
        legal_person: [
          { required: true, message: "请输入法定代表人", trigger: "blur" },
          {
            min: 3,
            max: 120,
            message: "长度在 3 到 120 个字符",
            trigger: "blur"
          }
        ],
        legal_address: [
          { required: true, message: "请输入登记地址", trigger: "blur" },
          {
            min: 3,
            max: 120,
            message: "长度在 3 到 120 个字符",
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
      this.$router.push({ name: "FirmIndex" });
    },
    handleRemoveLogo(file, fileList) {
      console.log("handleRemoveLogo", file, fileList);
      this.form.license_picture = "";
    },
    handleSuccessLogo(url, file) {
      console.log("handleSuccessLogo", url, file);
      this.form.license_picture = url;
    },
    handleErrorLogo(err, file) {
      console.log("handleErrorLogo", err, file);
      this.form.license_picture = "";
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

