// 播放图标. 位于mv或歌曲的图片中间, 鼠标hover就显示,鼠标离开就隐藏的红色三角图标
<template>
  <div class="play-icon">
    <div class="icon-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
      <i
        class="iconfont icon-bofang"
        :style="{ fontSize: fontSize + 'px', marginLeft: size / 20 + 'px', marginTop: size / 20 + 'px' }"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  props: { size: Number },
  setup(props) {
    let fontSize = 0
    if (props.size > 30) {
      fontSize = props.size / 2.7
    } else {
      fontSize = props.size / 2.3
    }
    return { fontSize }
  },
}
</script>

<style lang="less" scoped>
.play-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  &:hover .icon-wrapper {
    opacity: 1;
  }
  .icon-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: @font-color-transparent;
    transition: 0.3s;
    opacity: 0;
    cursor: pointer;
    i {
      color: @theme-color;
    }
  }
}
</style>
