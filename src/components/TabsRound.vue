<template>
  <div class="tabs-round">
    <div class="tabs-row" v-for="(row, key, index) in tabs" :key="index">
      <span class="row-name">{{ row.name }}：</span>
      <ul class="options">
        <li
          class="option"
          :class="{ on: option.on }"
          v-for="(option, index) in row.options"
          :key="index"
          @click="clickOption(option, row)"
        >
          {{ option.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue"
export default {
  setup() {
    const tabs = reactive({
      location: {
        name: "地区",
        options: [
          { name: "全部", on: true },
          { name: "内地", on: false },
          { name: "港台", on: false },
          { name: "欧美", on: false },
          { name: "日本", on: false },
          { name: "韩国", on: false },
        ],
      },
      type: {
        name: "类型",
        options: [
          { name: "全部", on: true },
          { name: "官方版", on: false },
          { name: "原声", on: false },
          { name: "现场版", on: false },
          { name: "网易出品", on: false },
        ],
      },
      sort: {
        name: "排序",
        options: [
          { name: "上升最快", on: true },
          { name: "最热", on: false },
          { name: "最新", on: false },
        ],
      },
    })
    //选项被点击后,把选项所在数组中所有项的on重置为false,被点击的选项on赋值为true
    function clickOption(option, row) {
      row.options.forEach((item) => {
        item.on = false
      })
      option.on = true
    }

    return { tabs, clickOption }
  },
}
</script>

<style lang="less" scoped>
.tabs-round {
  .tabs-row {
    display: flex;
    align-items: center;
    height: 24px;
    margin-bottom: 16px;
    font-size: @font-size-sm;
    .row-name {
      color: var(--font-color);
    }
    .options {
      display: flex;
      align-items: center;
      height: 100%;
      .option {
        position: relative;
        margin: 0 16px;
        padding: 4px 12px;
        border-radius: 11px;
        color: var(--tab-item-color);
        cursor: pointer;
        &:hover {
          color: var(--tab-item-hover-color);
          // color: #343434;
        }
        &:not(:last-child)::after {
          content: "";
          position: absolute;
          right: -16px;
          width: 1px;
          height: 16px;
          background: var(--border);
        }
        &.on {
          color: @theme-color;
          background: var(--shallow-theme-bgcolor);
        }
      }
    }
  }
}
</style>
