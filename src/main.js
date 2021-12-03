import { createApp } from "vue"
import App from "./App.vue"
// 路由
import router from "@/router/index"

import "@/style/reset.less"
import "@/style/common.less"
import "@/utils/rem"

// 这里把createApp(App).use(router).mount("#app")拆开写, 看起来清晰一点
const app = createApp(App)
// 使用路由
app.use(router)
app.mount("#app")
