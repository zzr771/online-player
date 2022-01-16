import { createRouter, createWebHashHistory } from "vue-router/dist/vue-router.esm-bundler"
import store from "@/store/index"

const routes = [
  {
    name: "discovery",
    path: "/discovery",
    component: () => import("@/pages/Discovery/Discovery"),
    meta: {
      // 是否显示左侧菜单栏
      showSideMenu: true,
      // 是否开启keep-alive
      keepAlive: true,
    },
  },
  {
    name: "reclists",
    path: "/reclists",
    component: () => import("@/pages/RecLists/RecLists"),
    meta: {
      showSideMenu: true,
      keepAlive: true,
    },
  },
  {
    name: "newSongs",
    path: "/newSongs",
    component: () => import("@/pages/NewSongs/NewSongs"),
    meta: {
      showSideMenu: true,
      keepAlive: true,
    },
  },
  {
    name: "newmvs",
    path: "/newmvs",
    component: () => import("@/pages/NewMVs/NewMVs"),
    meta: {
      showSideMenu: true,
      keepAlive: true,
    },
  },
  {
    name: "mv",
    path: "/mv/:MVID",
    props: true,
    component: () => import("@/pages/MV/MV"),
    meta: {
      showSideMenu: false,
      keepAlive: false,
      // 切换到该路由页时, 页面是否自动回到顶部
      autoTop: true,
    },
  },
  {
    name: "playlistDetail",
    path: "/playlistDetail",
    component: () => import("@/pages/PlaylistDetail/PlaylistDetail"),
    props($route) {
      return { id: $route.query.id }
    },
    meta: {
      showSideMenu: true,
      autoTop: true,
    },
  },
  {
    name: "search",
    path: "/search",
    props($route) {
      return { keyword: $route.query.keyword }
    },
    component: () => import("@/pages/Search/Search"),
    meta: {
      showSideMenu: true,
    },
    children: [
      {
        path: "songs",
        name: "search-songs",
        component: () => import("@/pages/Search/routes/Songs"),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "lists",
        name: "search-lists",
        component: () => import("@/pages/Search/routes/Lists"),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "mvs",
        name: "search-mvs",
        component: () => import("@/pages/Search/routes/MVs"),
        meta: {
          keepAlive: true,
        },
      },
      {
        path: "",
        redirect: "/search/songs",
      },
    ],
  },
  {
    path: "/",
    redirect: "/discovery",
  },
]

const router = createRouter({
  history: createWebHashHistory("/online-player/"),
  routes,
})
export default router

/* -------------------保存一些路由页面的滚动位置,下一次回来时恢复原先的滚动位置------------------
    当要跳转的路由页的autoTop属性为true时, 使该路由页滚动到顶部
    当要跳转到开启keep-alive的页面时,使页面内容自动滚动到上次的位置

    但是, 路由页是包含在一个id="content"的元素内部的,所以,
      设置 window.scrollTo(0,0) 或者 document.body.scrollTop = 0
      或者 document.documentElement.scrollTop = 0 都无效.
      因为body没有滚动, content元素才是滚动发生的容器
    所以该百年content的scrollTop值
  */
let contentDiv
router.afterEach((to, from) => {
  // 避免重复遍历获取contentDiv
  if (!contentDiv) {
    contentDiv = document.getElementById("content")
  }
  // 如果目标路由页面需要位于顶部
  if (to.meta.autoTop) {
    contentDiv.scrollTop = 0
    return
  }
  // 如果目标路由开启了keepAlive
  else if (to.meta.keepAlive) {
    const previousPositions = store.state.global.previousPositions
    const previousPosition = previousPositions.find((p) => {
      return p.routeName === to.name
    })
    // 如果previousPosition存在
    if (previousPosition) {
      contentDiv.scrollTop = previousPosition.position
    }
  }
})

router.beforeEach((to, from, next) => {
  // 检查是否有全局loading. 如果有, 就不允许切换路由, 等到该异步请求结束后才能允许
  if (store.state.global.showLoading === 1) {
    return
  }

  // 离开keepAlive路由之前,保存页面滚动位置
  // 页面第一次加载,是通过重定向打开的/discovery, from.name为空
  if (!from.meta.keepAlive || !from.name) {
    next()
  } else {
    if (!contentDiv) {
      contentDiv = document.getElementById("content")
    }
    const position = contentDiv.scrollTop
    store.commit("global/updatePreviousPositions", { routeName: from.name, position })
    next()
  }
})
