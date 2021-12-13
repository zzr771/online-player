// 标签组 基本款
<template>
  <div class="tabs-basic">
    <span
      class="tab-basic"
      :class="{ on: tab.on }"
      v-for="(tab, index) in tabs"
      :key="index"
      @click="clickHandler(tab)"
      >{{ tab.name }}</span
    >
  </div>
</template>

<script>
import { onMounted, inject } from "vue"
export default {
  setup() {
    // 加载前把第一个tab(全部)的on属性变为true
    let tabs = inject("tabs")
    onMounted(() => {
      tabs[0].on = true
    })
    // 将被点击的tab的on属性变为true,其余tab.on都变为false
    function clickHandler(tab) {
      tabs.forEach((tab) => {
        tab.on = false
      })
      tab.on = true
    }
    return { clickHandler, tabs }
  },
}
</script>

<style lang="less" scoped>
.tabs-basic {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 38px;
  .tab-basic {
    padding: 12px 0;
    margin: 0 12px;
    color: var(--tab-item-color);
    font-size: @font-size-sm;
    cursor: pointer;
    &.on {
      color: @theme-color;
    }
  }
}
</style>
