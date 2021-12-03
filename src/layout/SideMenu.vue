<template>
  <div class="side-menu" v-show="$route.meta.showSideMenu">
    <div class="user" @click="showLoginWindow = !showLoginWindow">
      <div class="user-icon">
        <i class="iconfont icon-yonghu"></i>
        <p>未登录</p>
      </div>
      <transition name="fadeMove">
        <div class="login-window-wrapper" v-show="showLoginWindow">
          <div class="login-window" @click.stop="">
            <div class="login-title">
              <p>登录</p>
              <i class="iconfont icon-guanbi" @click="showLoginWindow = false"></i>
            </div>
            <input type="text" placeholder="请输入您的网易云UID" class="login-input" />
            <div class="login-body">
              <p>
                1. 请点击
                <a href="http://music.163.com">http://music.163.com</a> 打开网易云音乐
              </p>
              <p>2. 点击页面右上角的“登录”</p>
              <p>3. 点击您的头像，进入我的主页</p>
              <p>4. 复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）</p>
            </div>
            <div class="login-btn">登录</div>
          </div>
        </div>
      </transition>
    </div>
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
      <div class="user-lists-wrapper">
        <p class="title">创建的歌单</p>
        <ul class="user-lists">
          <li>
            <a href="#">
              <i class="iconfont icon-gedan"></i>
              <span>我喜欢的音乐</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="iconfont icon-gedan"></i>
              <span>新歌单</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
export default {
  setup() {
    let showLoginWindow = ref(false)
    return { showLoginWindow }
  },
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
  .user {
    padding: 20px 18px;
    padding-bottom: 0;
    margin-bottom: 12px;
    .user-icon {
      display: flex;
      cursor: pointer;
      i {
        font-size: 21px;
        margin-right: 10px;
      }
      p {
        line-height: 22px;
        font-size: 100%;
      }
    }
    .login-window-wrapper {
      position: fixed;
      z-index: 900;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      .login-window {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -70%);
        width: 320px;
        height: 325px;
        padding: 20px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        border-radius: 2px;
        background-color: var(--modal-bg-color);
        .login-title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          i {
            color: #999;
            cursor: pointer;
            &:hover {
              color: @theme-color;
            }
          }
        }
        input {
          border: none;
          outline: none;
          width: 100%;
          height: 24px;
          padding: 0 15px;
          border-radius: 4px;
          margin-bottom: 15px;
          color: var(--header-input-color);
          background-color: var(--input-bgcolor);
        }
        .login-body {
          margin-bottom: 20px;
          p {
            line-height: 22px;
          }
        }
        .login-btn {
          width: 100%;
          height: 30px;
          line-height: $height;
          text-align: center;
          border-radius: 4px;
          font-size: @font-size-medium-sm;
          color: #fff;
          background-color: @theme-color;
          cursor: pointer;
        }
      }
    }
  }
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
&.fadeMove-enter-active,
&.fadeMove-leave-active {
  transition: 0.25s;
}
&.fadeMove-enter-from,
&.fadeMove-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>
