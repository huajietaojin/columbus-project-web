<template>
  <div class="app-container">
    <el-row>
      <el-alert v-if="notify"
        title="您还没有添加企业信息, 请先在[管理设置/企业设置]中填写企业信息，填写完成后才能使用！"
        type="warning"
        show-icon>
      </el-alert>
    </el-row>
    <el-row>
      <store-video-form :stores="stores" :editable="editable" :loading="loading" @submit="submitForm"></store-video-form>
    </el-row>
  </div>
</template>

<script>
import StoreVideoForm from "./widget/StoreVideoForm";
import storeVideoService from "@/api/store-video-service.js";
import storeService from "@/api/store-service.js";
import { mapGetters } from "vuex";

export default {
  components: {
    StoreVideoForm
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
      stores: []
    };
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      that.loading = true;
      storeVideoService.create(params).then(res => {
        that.$message.success("提交成功");
        that.loading = false;
        that.$router.push({ name: "StoreVideoIndex" });
      }).catch(err => {
        that.$message.error(err);
        that.loading = false;
      })
    },
    listStores() {
      if (!this.firm || !this.firm.id) {
        return;
      }

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
        })
        .catch(err => {
          console.log("list err", err);
        });
    }
  },
  created() {
    this.listStores();
  }
};
</script>
