<template>
  <div class="app-container">
    <el-row>
      <store-video-form :stores="stores" :store-video="storeVideo" :editable="editable"></store-video-form>
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
      editable: false,
      storeVideo: null,
      storeVideoId: null,
      stores: []
    };
  },
  created() {
    this.storeVideoId = this.$route.params.id;
    this.fetchData(this.$route.params.id);
  },
  methods: {
    fetchData(id) {
      const that = this;
      storeVideoService.get(id).then(response => {
        that.storeVideo = response.data;
        that.listStores(that.storeVideo.firm_id);
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
