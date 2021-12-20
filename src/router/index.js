import { createRouter, createWebHistory } from "vue-router/dist/vue-router.esm-bundler"

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
      keepAlive: true,
      // 切换到该路由页时, 页面是否自动回到顶部
      autoTop: true,
    },
  },
  {
    name: "search",
    // path: "/search/:keyword",
    // props: true,
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
        props($route) {
          return { keyword: $route.query.keyword }
        },
        component: () => import("@/pages/Search/routes/Songs"),
      },
      {
        path: "lists",
        name: "search-lists",
        props($route) {
          return { keyword: $route.query.keyword }
        },
        component: () => import("@/pages/Search/routes/Lists"),
      },
      {
        path: "mvs",
        name: "search-mvs",
        props($route) {
          return { keyword: $route.query.keyword }
        },
        component: () => import("@/pages/Search/routes/MVs"),
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
  history: createWebHistory(),
  routes,
})

export default router
