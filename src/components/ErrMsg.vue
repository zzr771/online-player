<template>
  <transition name="fade">
    <div class="err-msg-bg" @click="close" v-if="reqErrMsg.length">
      <div class="err-msg" @click.stop="">
        <div class="title">出错了</div>
        <p class="msg">{{ reqErrMsg }}</p>
        <div class="btn" @click="close">确定</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { useStore } from "vuex"
import { computed } from "vue"
export default {
  setup() {
    const store = useStore()

    let reqErrMsg = computed(() => store.state.global.reqErrMsg)

    function close() {
      store.commit("global/setreqErrMsg", { msg: "" })
    }

    return { reqErrMsg, close }
  },
}
</script>

<style lang="less" scoped>
.err-msg-bg {
  position: fixed;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .err-msg {
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 300px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    background: var(--modal-bg-color);
    .title {
      margin-bottom: 30px;
      text-align: center;
      font-size: @font-size-medium-sm;
    }
    .msg {
      text-align: center;
      margin-bottom: 30px;
    }
    .btn {
      margin: 0 auto;
      width: 70%;
      padding: 8px;
      text-align: center;
      border-radius: 5px;
      background-color: @theme-color;
      font-size: @font-size-medium-sm;
      color: @white;
      cursor: pointer;
    }
  }
}
</style>
