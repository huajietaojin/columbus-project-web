<template>
    <div>
    <el-row v-if="notify">
      <span @click="toFirmPage">
      <el-alert
        title="您还没有添加企业信息, 请先在 [ 运营管理 / 企业设置 ] 中填写企业信息，点击这里进行编辑！"
        :type="color"
        :closable="closable"
        show-icon>
      </el-alert>
      </span>
    </el-row>
    </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "warning"
    },
    notify: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    toFirmPage() {
      this.$router.push({ name: "FirmUpdate" });
    }
  }
};
</script>