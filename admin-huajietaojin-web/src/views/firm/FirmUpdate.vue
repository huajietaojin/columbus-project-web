<template>
  <div class="app-container">
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
    this.firmId = this.$route.params.id
    this.fetchData(this.firmId)
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      that.loading = true;
      firmService.update(this.firmId, params).then(res => {
        that.$message.success("提交成功");
        that.loading = false;
        that.$router.push({ name: 'FirmIndex' })
      }).catch(err => {
        that.$message.error(err);
        that.loading = false;
      })
    },
    onCancel() {
      this.$router.push({ name: 'FirmIndex' })
    },
    fetchData(id) {
      const that = this
      firmService.get(id).then(response => {
        that.firm = response.data
      })
    }
  }
}
</script>
