import { createApp } from "vue"
import App from "./App.vue"
// 路由
import router from "@/router/index"
// Vuex
import store from "@/store/index"

import "@/style/reset.less"
import "@/style/common.less"
import "@/utils/rem"

// createApp(App).use(router).use(store).mount("#app")拆开写
const app = createApp(App)
app.use(router)
app.use(store)
app.mount("#app")
