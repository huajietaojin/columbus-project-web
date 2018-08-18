<template>
  <div>
    <firm-form :editable="editable" @submit="submitForm"></firm-form>
  </div>
</template>

<script>
import FirmForm from './widget/FirmForm'
import firmService from '@/api/firm-service.js'

export default {
  components: {
    FirmForm
  },
  data() {
    return {
      editable: true
    }
  },
  methods: {
    submitForm: function(params) {
      const that = this
      firmService.create(params).then(res => {
        console.log('create', res)
        that.$message({
          message: '提交成功',
          type: 'success'
        })
        that.$router.push({ name: 'FirmIndex' })
      })
    }
  }
}
</script>
