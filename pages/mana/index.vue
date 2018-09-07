<template>
  <div class="ContensWrap">
    <h1>合同管理</h1>
  </div>
</template>

<script>
export default {
  layout: "ec",
  name:'mana',
  fetch({ route, redirect }) {
    if (route.name === "mana") {
      return redirect("/mana/list");
    }
  },
  components: {},
  watch: {},
  head() {
    return {
      title: "合同管理 - 微企宝",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "合同管理列表页"
        }
      ]
    };
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
</style>
