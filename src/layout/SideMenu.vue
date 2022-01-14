<template>
  <div class="side-menu" v-show="$route.meta.showSideMenu">
    <User></User>
    <div class="menu-list">
      <ul class="menu-options">
        <li>
          <router-link to="/discovery">
            <i class="iconfont icon-faxian"></i>
            <span>发现音乐</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reclists">
            <i class="iconfont icon-tuijian"></i>
            <span>推荐歌单</span>
          </router-link>
        </li>
        <li>
          <router-link to="/newSongs">
            <i class="iconfont icon-yinle"></i>
            <span>最新音乐</span>
          </router-link>
        </li>
        <li>
          <router-link to="/newmvs">
            <i class="iconfont icon-bofangMV"></i>
            <span>最新MV</span>
          </router-link>
        </li>
      </ul>
      <div class="user-lists-wrapper" v-if="userPlaylists.length">
        <p class="title">我的歌单</p>
        <ul class="user-lists">
          <li
            v-for="(userPlaylist, index) in userPlaylists"
            :key="index"
            @click="$router.push({ path: '/playlistDetail', query: { id: userPlaylist.id } })"
          >
            <a href="javascript:;">
              <i class="iconfont icon-gedan"></i>
              <span>{{ userPlaylist.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue"
import { useStore } from "vuex"
import User from "@/components/User"
export default {
  setup() {
    const store = useStore()

    let userPlaylists = computed(() => store.state.user.userPlaylists)

    return { userPlaylists }
  },
  components: { User },
}
</script>

<style lang="less" scoped>
.side-menu {
  flex: none;
  display: flex;
  flex-direction: column;
  width: 250px;
  color: var(--font-color);
  height: calc(100% - @mini-player-height);
  background-color: var(--menu-bgcolor);
  .menu-list {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    li {
      display: flex;
      a {
        width: 100%;
        height: 100%;
        padding: 12px 18px;
        text-decoration: none;
        color: var(--font-color);
        &.router-link-active {
          background-color: var(--menu-item-active-bg);
          color: @theme-color;
        }
        &:hover {
          background-color: var(--menu-item-hover-bg);
        }
        i {
          margin-right: 10px;
          font-size: 16px;
        }
        span {
          font-size: @font-size-medium-sm;
          vertical-align: middle;
        }
      }
    }
    .user-lists-wrapper {
      margin-top: 16px;
      .title {
        margin-bottom: 8px;
        padding-left: 16px;
        font-size: @font-size-sm;
        color: var(--font-color-grey2);
      }
    }
  }
}
</style>
