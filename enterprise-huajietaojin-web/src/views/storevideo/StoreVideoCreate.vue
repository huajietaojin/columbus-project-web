<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify" color="error"></init-alert>
    </el-row>
    
    <el-row>
      <store-video-form :fetching="fetching" :stores="stores" :editable="editable" :loading="loading" @submit="submitForm"></store-video-form>
    </el-row>
  </div>
</template>

<script>
import StoreVideoForm from "./widget/StoreVideoForm";
import storeVideoService from "@/api/store-video-service.js";
import storeService from "@/api/store-service.js";
import { mapGetters } from "vuex";
import InitAlert from "@/components/InitAlert";

export default {
  components: {
    StoreVideoForm,
    InitAlert
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
      fetching: false,
      stores: []
    };
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      that.loading = true;
      storeVideoService
        .create(params)
        .then(res => {
          that.$message.success("提交成功");
          that.loading = false;
          that.$router.push({ name: "StoreVideoIndex" });
        })
        .catch(err => {
          that.$message.error(err);
          that.loading = false;
        });
    },
    listStores() {
      if (!this.firm || !this.firm.id) {
        return;
      }
      this.fetching = true;
      let firmId = this.firm.id;
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
          that.fetching = false;
        })
        .catch(err => {
          console.log("list err", err);
          that.fetching = false;
        });
    }
  },
  created() {
    this.listStores();
  }
};
</script>
