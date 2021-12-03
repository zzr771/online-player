import { createRouter, createWebHistory } from "vue-router/dist/vue-router.esm-bundler"

const routes = [
  {
    name: "discovery",
    path: "/discovery",
    component: () => import("@/pages/Discovery/Discovery"),
    meta: {
      showSideMenu: true,
    },
  },
  {
    name: "reclists",
    path: "/reclists",
    component: () => import("@/pages/RecLists/RecLists"),
    meta: {
      showSideMenu: true,
    },
  },
  {
    name: "newSongs",
    path: "/newSongs",
    component: () => import("@/pages/NewSongs/NewSongs"),
    meta: {
      showSideMenu: true,
    },
  },
  {
    name: "newmvs",
    path: "/newmvs",
    component: () => import("@/pages/NewMVs/NewMVs"),
    meta: {
      showSideMenu: true,
    },
  },
  {
    name: "mv",
    path: "/mv/:MVID",
    props: true,
    component: () => import("@/pages/MV/MV"),
    meta: {
      showSideMenu: false,
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

export default createRouter({
  history: createWebHistory(),
  routes,
})
