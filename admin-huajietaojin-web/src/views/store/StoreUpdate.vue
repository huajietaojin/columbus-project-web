<template>
  <div class="app-container">
    <el-row>
      <store-form :store="store" :firm="firm" :editable="editable" :loading="loading" @submit="submitForm"></store-form>
    </el-row>
  </div>
</template>

<script>
import StoreForm from "./widget/StoreForm";
import storeService from "@/api/store-service.js";
import { mapGetters } from "vuex";

export default {
  components: {
    StoreForm
  },
  computed: {
    ...mapGetters(["firm"]),
    notify: function() {
      return !this.firm || !this.firm.id;
    }
  },
  data() {
    return {
      editable: true,
      loading: false,
      store: null,
      storeId: null
    };
  },
  created() {
    this.storeId = this.$route.params.id;
    this.fetchData(this.storeId);
  },
  methods: {
    submitForm: function(params) {
      let that = this;
      that.loading = true;
      storeService.update(this.storeId, params).then(res => {
        that.$message.success("提交成功");
        that.loading = false;
        that.$router.push({ name: "StoreIndex" });
      }).catch(err => {
        that.$message.error(err);
        that.loading = false;
      })
    },
    onCancel() {
      this.$router.push({ name: "StoreIndex" });
    },
    fetchData(id) {
      let that = this;
      storeService.getExtraWithPicture(id).then(response => {
        // console.log(response.data);
        that.store = response.data;
      });
    }
  }
};
</script>
