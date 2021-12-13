// 位于页面顶部header左侧的两个按钮, 控制路由的前进和后退
<template>
  <div class="route-control">
    <span @click="$router.back()"><i class="iconfont icon-back"></i></span>
    <span @click="$router.forward()"><i class="iconfont icon-next"></i></span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.route-control {
  display: flex;
  margin-left: 30px;
  margin-top: 3px;
  span {
    width: 25px;
    height: $width;
    text-align: center;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background-color: var(--round-hover-bgcolor);
    }
    i {
      font-size: 22px;
      color: var(--header-font-color);
      &.icon-back {
        margin-left: 3px;
      }
    }
  }
}
</style>
