<template>
  <div class="mv-card" @click="routeGo">
    <div class="img-part">
      <img src="@/pages/Discovery/images/mvs/1.jpg" alt="" />
      <div class="play-count">
        <i class="iconfont icon-bofang"></i>
        2313
      </div>
      <div class="play-icon">
        <i class="iconfont icon-bofang"></i>
      </div>
    </div>
    <p class="name">Por Amor al Arte (Video Oficial)</p>
    <p class="author">Sergio Dalma</p>
  </div>
</template>

<script>
import { useRouter } from "vue-router"
export default {
  setup() {
    const router = useRouter()
    function routeGo() {
      router.push({ path: `/mv/777` })
    }

    return { routeGo }
  },
}
</script>

<style lang="less" scoped>
.mv-card {
  position: relative;
  width: 25%;
  padding: 0 12px;
  margin-bottom: 36px;
  cursor: pointer;
  .img-part {
    position: relative;
    &:hover .play-icon {
      opacity: 1;
    }
    img {
      width: 100%;
      border-radius: 5px;
    }
    .play-count {
      position: absolute;
      top: 3px;
      right: 3px;
      font-size: 12px;
      color: #fff;
      i {
        font-size: 100%;
      }
    }
    .play-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: $width;
      line-height: $height;
      text-align: center;
      border-radius: 50%;
      background-color: @font-color-transparent;
      transition: 0.4s;
      opacity: 0;
      i {
        font-size: 18px;
        vertical-align: middle;
        color: @theme-color;
      }
    }
  }
  .name,
  .author {
    font-size: @font-size-sm;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .name {
    margin-top: 8px;
  }
  .author {
    margin-top: 4px;
    color: var(--font-color-grey-shallow);
  }
}
</style>
