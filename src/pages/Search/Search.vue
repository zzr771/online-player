// 搜索页面, 一级路由页. 通过页面右上方的搜索框来触发弹出
<template>
  <div class="search clearfix" id="search">
    <div class="header">
      <div class="title">
        {{ keyword }}
        <span>找到{{ resultsCount }}个结果</span>
      </div>
      <div class="tabs">
        <router-link :to="{ path: '/search/songs', query: { keyword } }">歌曲</router-link>
        <router-link :to="{ path: '/search/lists', query: { keyword } }">歌单</router-link>
        <router-link :to="{ path: '/search/mvs', query: { keyword } }">MV</router-link>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" />
    </router-view>
  </div>
</template>

<script>
import { ref, reactive, provide, watch } from "vue"
import { useRoute } from "vue-router"
import { reqSearch } from "@/api/search"

const LIMITS = { "search-songs": 30, "search-mvs": 20, "search-lists": 20 }
const TYPES = { "search-songs": 1, "search-mvs": 1004, "search-lists": 1000 }
export default {
  props: { keyword: String },
  setup() {
    const route = useRoute()

    // provide只能在setup中使用,所以一开始就要把data传递给子路由,data随时会变化,所以只能用响应式
    let data = reactive({ keyword: "", "search-songs": [], "search-mvs": [], "search-lists": [] })
    provide("data", data)

    // 保存各个子路由的当前页码,页码变化就发送请求. keyword变化时,在子路由中把对应的页码重置为1
    let currentPages = reactive({ "search-songs": 1, "search-mvs": 1, "search-lists": 1 })
    provide("uploadCurrentPage", (value) => {
      currentPages[route.name] = value
    })
    watch(currentPages, () => {
      getData()
      document.getElementById("search").scrollIntoView({ behavior: "smooth" })
    })

    // 搜索结果数.
    let resultsCount = ref(0)
    let counts = {
      "search-songs": { name: "songCount", count: 0 },
      "search-mvs": { name: "mvCount", count: 0 },
      "search-lists": { name: "playlistCount", count: 0 },
    }

    // 监视route.name,进入不同的子路由时重新发送请求
    watch(
      () => route.name,
      (newValue) => {
        // 防止监视其他路由路径
        if (!newValue.includes("search-")) return

        getData()
        /*
          如果是从来没法发送过的请求, 那么先执行下面的代码, 此时请求还未获得响应,resultsCount被赋值为0
            然后在getData()内部, 获得响应后, 再次给resultsCount赋予一个正确的值
          如果是发送过的请求, 那么getData()会直接return. 此时去读取counts中保存的总结果数就行了
        */
        resultsCount.value = counts[route.name].count
      },
      { immediate: true }
    )

    // 监视route.query.keyword, 每次变化时重新发送请求
    watch(
      () => route.query.keyword,
      (newValue) => {
        if (newValue) {
          getData()
        }
      }
    )

    async function getData() {
      // 如果搜索关键词没变化,并且data中已经有了对应的数据,那么就不再重复发送请求
      if (data.keyword === route.query.keyword && data[route.name].length) {
        return
      }
      data.keyword = route.query.keyword

      // 准备请求参数
      let params = {
        keywords: route.query.keyword,
        limit: LIMITS[route.name],
        offset: LIMITS[route.name] * (currentPages[route.name] - 1),
        type: TYPES[route.name],
      }
      // api有问题,搜索歌曲时,limit为30,返回不到30个结果;limit为31,返回31个
      if (route.name === "search-songs") {
        params.limit = 31
      }
      // 把不同类型的搜索结果保存在data的不同属性中
      data[route.name] = await reqSearch(params)
      // 保存结果总数
      let countName = counts[route.name].name
      counts[route.name].count = data[route.name].result[countName]
      // 执行到这里,说明这是一个从来没有发送过的请求,就直接改变resultsCount
      resultsCount.value = data[route.name].result[countName]
    }

    return { resultsCount }
  },
}
</script>

<style lang="less" scoped>
.header {
  border-bottom: 1px solid var(--border);
  .title {
    padding: 20px 12px;
    // padding: 20px 32px;
    font-size: @font-size-title-lg;
    font-weight: bold;
    span {
      margin-left: 5px;
      font-size: @font-size-sm;
      color: var(--font-color-grey-shallow);
      letter-spacing: 1px;
      font-weight: normal;
    }
  }
  .tabs {
    display: flex;
    // padding-left: 25px;
    a {
      padding: 12px 0;
      margin: 0 12px;
      text-decoration: none;
      color: var(--font-color-grey2);
      &.router-link-active {
        color: var(--tab-item-active-color);
      }
    }
  }
}
</style>
