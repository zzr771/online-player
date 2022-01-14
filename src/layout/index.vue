<template>
  <div class="layout">
    <Header></Header>
    <div class="layout-body">
      <SideMenu></SideMenu>
      <div class="content" id="content">
        <div class="w">
          <!-- vue3中使路由页面keep-alive的写法 -->
          <router-view v-slot="{ Component }">
            <!-- 当多个页面都需要keep-alive时,必须添加key属性.让Vue能识别不同的页面  -->
            <keep-alive>
              <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path" />
            </keep-alive>
            <component :is="Component" v-if="!$route.meta.keepAlive" />
          </router-view>
          <transition name="fade">
            <Loading></Loading>
          </transition>
        </div>
      </div>
    </div>
    <ErrMsg></ErrMsg>
  </div>
</template>

<script>
import Header from "./Header"
import SideMenu from "./SideMenu"
import ErrMsg from "@/components/ErrMsg"
import Loading from "@/components/Loading"
export default {
  components: {
    Header,
    SideMenu,
    ErrMsg,
    Loading,
  },
}
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  .layout-body {
    display: flex;
    height: calc(100% - @header-height);
    .content {
      position: relative;
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      min-width: @layout-content-min-width;
      margin-bottom: @mini-player-height;
      .w {
        margin: 0 auto;
        max-width: 1000px;
      }
    }
  }
}
</style>
