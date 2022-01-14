import { createApp } from "vue"
import App from "./App.vue"
// 路由
import router from "@/router/index"
// Vuex
import store from "@/store/index"
// 懒加载
import lazyPlugin from "vue3-lazy"

import "@/style/reset.less"
import "@/style/common.less"
import "@/utils/rem"

// createApp(App).use(router).use(store).mount("#app")拆开写
const app = createApp(App)
app.use(router)
app.use(store)
app.use(lazyPlugin, {
  loading: require("@/assets/images/lazy-loading.png"), // 加载时默认图片
})
app.mount("#app")
