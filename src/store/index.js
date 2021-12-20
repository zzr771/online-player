import { createStore } from "vuex"
import music from "./music/index"
import global from "./global/index"

export default createStore({
  modules: {
    music,
    global,
  },
})
