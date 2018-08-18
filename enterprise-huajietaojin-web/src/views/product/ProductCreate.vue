<template>
  <div class="app-container">
    <el-row>
      <init-alert :notify="notify" color="error"></init-alert>
    </el-row>

    <el-row>
      <product-form :stores="stores" :editable="editable" :loading="loading" @submit="submitForm"></product-form>
    </el-row>
  </div>
</template>

<script>
import ProductForm from "./widget/ProductForm";
import productService from "@/api/product-service.js";
import storeService from "@/api/store-service.js";
import { mapGetters } from "vuex";
import InitAlert from "@/components/InitAlert"

export default {
  components: {
    ProductForm,InitAlert
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
      productService.create(params).then(res => {
        that.$message.success("提交成功");
        that.loading = false;
        that.$router.push({ name: "ProductIndex" });
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
