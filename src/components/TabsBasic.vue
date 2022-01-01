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
import { inject } from "vue"
export default {
  setup() {
    // tabs中的每个对象必须具有name和on属性
    let tabs = inject("tabs")

    // 将被点击的tab的on属性变为true
    let previousOnTab = tabs[0]
    function clickHandler(tab) {
      if (previousOnTab !== tab) {
        tab.on = true
        previousOnTab.on = false
        previousOnTab = tab
      }
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
