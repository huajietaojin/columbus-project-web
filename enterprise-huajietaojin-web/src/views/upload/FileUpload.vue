<template>
  <div class="app-container">
    <aliyun-uploader 
          :limit="limitSize"
          :file-list="existFileList"
          @on-remove="handleRemove"
          @on-success="handleSuccess"
          @on-error="handleError">
        <i class="el-icon-plus"></i>
    </aliyun-uploader>
  </div>  
</template>

<script>
import AliyunUploader from '@/components/AliyunUploader'

export default {
  components: { AliyunUploader },
  data() {
    return {
      limitSize: 3,
      existFileList: []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleSuccess(url, file) {
      console.log('handleSuccess', url, file)
    },
    handleError(err, file) {
      console.log('handleError', err, file)
    }
  }
}
</script>
      