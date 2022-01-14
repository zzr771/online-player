<template>
  <div class="loading-wrapper" v-if="showLoading === 1">
    <!-- showLoading === 1 -->
    <div class="loading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="50px"
        height="50px"
        viewBox="-2 -2 53 53"
        style="enable-background: new 0 0 50 50"
        xml:space="preserve"
      >
        <path
          d="m25,0a23,23 0 0 0 0,50"
          stroke="#d33a31"
          stroke-width="2"
          fill="transparent"
          transform="rotate(275.098 25 25)"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          ></animateTransform>
        </path>
      </svg>
      <p>&nbsp;加载中...</p>
    </div>
  </div>
</template>

<script>
import { computed } from "vue"
import { useStore } from "vuex"
export default {
  setup() {
    const store = useStore()
    let showLoading = computed(() => store.state.global.showLoading)
    return { showLoading }
  },
}
</script>

<style lang="less" scoped>
@diameter: 50px;
.loading-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: $width;
    background: radial-gradient(80px 80px, rgba(255, 255, 255, 0.4), transparent);
    p {
      margin-top: 10px;
      color: @theme-color;
    }
  }
}
</style>
