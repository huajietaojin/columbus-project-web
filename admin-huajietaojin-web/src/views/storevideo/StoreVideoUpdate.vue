<template>
  <div class="app-container">
    <el-row>
      <store-video-form :stores="stores" :store-video="storeVideo" :editable="editable" :loading="loading" @submit="submitForm"></store-video-form>
    </el-row>  
  </div>
</template>

<script>
import StoreVideoForm from "./widget/StoreVideoForm";
import storeVideoService from "@/api/store-video-service.js";
import storeService from "@/api/store-service.js";

export default {
  components: {
    StoreVideoForm
  },
  data() {
    return {
      editable: true,
      loading: false,
      storeVideo: null,
      storeVideoId: null,
      stores: []
    };
  },
  created() {
    this.storeVideoId = this.$route.params.id;
    this.fetchData(this.storeVideoId);
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      that.loading = true;
      storeVideoService.update(this.storeVideoId, params).then(res => {
        that.$message.success("提交成功");
        that.loading = false;
        that.$router.push({ name: "StoreVideoIndex" });
      }).catch(err => {
        that.$message.error(err);
        that.loading = false;
      })
    },
    fetchData(id) {
      const that = this;
      storeVideoService.get(id).then(response => {
        that.storeVideo = response.data;
        this.listStores(that.storeVideo.firm_id);
      });
    },
    listStores(firmId) {
      const that = this;
      const params = {
        $limit: 50,
        $offset: 0,
        firm_id: firmId
      };
      
      storeService
        .list(params)
        .then(response => {
          that.stores = response.data.list;
        })
        .catch(err => {
          console.log("list err", err);
        });
    }
  }
};
</script>
