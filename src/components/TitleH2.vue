// 最高级标题
<template>
  <h2 class="title">{{ title }}</h2>
</template>

<script>
export default {
  props: {
    title: String,
  },
}
</script>

<style lang="less" scoped>
.title {
  padding: 12px 0;
  color: var(--font-color-white);
  font-size: @font-size-title;
  font-weight: normal;
}
</style>
