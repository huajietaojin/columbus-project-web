<template>
  <div>
    <firm-form :firm="firm" :editable="editable" @submit="submitForm"></firm-form>
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
      editable: true,
      firm: null,
      firmId: null,
    }
  },
  created() {
    console.log('FirmDetail')
    this.firmId = this.$route.params.id
    this.fetchData(this.firmId)
  },
  methods: {
    submitForm: function(params) {
      console.log('submitForm', params)
      const that = this
      firmService.update(this.firmId, params).then(res => {
        console.log('update', res)
        that.$message({
          message: '提交成功',
          type: 'success'
        })
        that.$router.push({ name: 'FirmIndex' })
      })
    },
    onCancel() {
      this.$router.push({ name: 'FirmIndex' })
    },
    fetchData(id) {
      console.log(id, 'id')
      const that = this
      firmService.get(id).then(response => {
        console.log(response.data)
        that.firm = response.data
      })
    }
  }
}
</script>
