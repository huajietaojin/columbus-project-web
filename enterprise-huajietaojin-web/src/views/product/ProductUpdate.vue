<template>
  <div class="app-container">
    <el-row>
      <product-form :stores="stores" :product="product" :editable="editable" :loading="loading" @submit="submitForm"></product-form>
    </el-row>  
  </div>
</template>

<script>
import ProductForm from "./widget/ProductForm";
import productService from "@/api/product-service.js";
import storeService from "@/api/store-service.js";
import { mapGetters } from "vuex";

export default {
  components: {
    ProductForm
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
      product: null,
      productId: null,
      stores: []
    };
  },
  created() {
    this.productId = this.$route.params.id;
    this.fetchData(this.productId);
    this.listStores();
  },
  methods: {
    submitForm: function(params) {
      const that = this;
      that.loading = true;
      productService.update(this.productId, params).then(res => {
        that.$message.success("提交成功");
        that.loading = false;
        that.$router.push({ name: "ProductIndex" });
      }).catch(err => {
        that.$message.error(err);
        that.loading = false;
      })
    },
    fetchData(id) {
      const that = this;
      productService.get(id).then(response => {
        that.product = response.data;
      });
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
  }
};
</script>
