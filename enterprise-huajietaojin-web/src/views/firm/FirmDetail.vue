<template>
  <div>
    <firm-form :firm="firm" :editable="editable"></firm-form>
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
      editable: false,
      firm: null,
      firmId: null,
    }
  },
  created() {
    console.log('FirmDetail')
    this.firmId = this.$route.params.id
    this.fetchData(this.$route.params.id)
  },
  methods: {
    onCancel() {
      this.$router.push({ name: 'FirmList' })
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
