<template>
  <div class="app-container">
    <el-row>
      <store-form :store="store" :editable="editable"></store-form>
    </el-row>
  </div>
</template>

<script>
import StoreForm from "./widget/StoreForm";
import storeService from "@/api/store-service.js";

export default {
  components: {
    StoreForm
  },
  data() {
    return {
      editable: false,
      store: null,
      storeId: null
    };
  },
  created() {
    this.storeId = this.$route.params.id;
    this.fetchData(this.$route.params.id);
  },
  methods: {
    onCancel() {
      this.$router.push({ name: "StoreIndex" });
    },
    fetchData(id) {
      let that = this;
      storeService.getExtraWithPicture(id).then(response => {
        that.store = response.data;
      });
    }
  }
};
</script>
