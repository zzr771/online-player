import { createStore } from "vuex"
import music from "./music/index"
import global from "./global/index"
import user from "./user/index"

export default createStore({
  modules: {
    music,
    global,
    user,
  },
})
