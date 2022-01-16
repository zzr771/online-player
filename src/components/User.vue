// 位于sideMenu顶部的用户图标, 包含登录等功能
<template>
  <div class="user" @click="showLoginWindow = true">
    <div class="user-icon">
      <i class="iconfont icon-yonghu" v-if="!user.userId"></i>
      <img :src="genImgURL(user.avatarUrl, 80)" alt="" v-else />
      <p>{{ user.nickname ? user.nickname : "未登录" }}</p>
    </div>
    <transition name="fadeMove">
      <div class="login-window-wrapper" v-if="showLoginWindow" @click.stop="showLoginWindow = false">
        <div class="login-window" @click.stop="">
          <div class="title">
            <p>{{ user.userId ? "退出" : "登录" }}</p>
            <i class="iconfont icon-guanbi" @click="showLoginWindow = false"></i>
          </div>
          <div class="login-interface" v-if="!user.userId">
            <div class="input-wrapper">
              <input type="tel" placeholder="请输入手机号" class="login-input" v-model="phone" />
              <transition name="shake">
                <div class="reminder" v-if="reminderText.length">{{ reminderText }}</div>
              </transition>
            </div>
            <div class="input-wrapper">
              <input type="tel" placeholder="请输入验证码" class="login-input" v-model="captcha.captcha" />
              <div class="captcha-btn" @click="getCaptcha">{{ captcha.text }}</div>
            </div>
          </div>
          <div class="logout-interface" v-else>确定要退出登录吗?</div>
          <div class="login-btn" @click="logInOut">{{ user.userId ? "确定" : "登录" }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, watch, computed } from "vue"
import { useStore } from "vuex"
import { reqCaptcha, reqCaptchaVerify, reqLogin, reqLogout, reqUserPlaylists } from "@/api/user"
import { genImgURL } from "@/utils/common"
export default {
  setup() {
    const store = useStore()

    // 核心变量, 用户信息
    let user = computed(() => store.state.user.user)
    let showLoginWindow = ref(false)

    //-------------------------------------号码校验和登录,登出--------------------
    let phone = ref("")
    // captcha.timeCount为0,表示还没有发送验证码,或者可以再次发送验证码
    let captcha = reactive({ captcha: "", text: "获取验证码", timeCount: 0 })
    // 错误提示信息
    let reminderText = ref("")

    // 监视手机号,不允许输入非数字
    let previousPhone = ""
    watch(phone, (newValue) => {
      // 当手机号被清空, 错误提示信息也随之清空
      if (newValue === "") {
        reminderText.value = ""
      }
      // 如果手机号中包含非数字,则输入无效
      else if (/\D/.test(newValue)) {
        phone.value = previousPhone
        return
      }
      previousPhone = newValue
    })

    // 监视captcha,不允许非数字,不允许大于4位
    let previousCaptcha = ""
    watch(
      () => captcha.captcha,
      (newValue) => {
        if (/\D/.test(newValue)) {
          captcha.captcha = previousCaptcha
          return
        }
        // 不允许非数字
        else if (/\D/.test(newValue)) {
          captcha.captcha = previousCaptcha
          return
        }
        // 不允许超过4位
        else if (newValue.length > 4) {
          captcha.captcha = previousCaptcha
          return
        }
        previousCaptcha = captcha.captcha
      }
    )

    // 控制"获取验证码"按钮显示内容
    function setCaptchaText() {
      captcha.timeCount = 60
      captcha.text = `重新发送(${captcha.timeCount}s)`
      let timer = setInterval(() => {
        captcha.timeCount--
        captcha.text = `重新发送(${captcha.timeCount}s)`

        if (captcha.timeCount === 0) {
          clearInterval(timer)
          captcha.text = "获取验证码"
        }
      }, 1000)
    }

    // 手机号格式校验
    function checkPhone() {
      // 手机号
      if (phone.value === "") {
        reminderText.value = "请输入手机号"
        return false
      } else {
        let phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (!phoneReg.test(phone.value)) {
          reminderText.value = "手机号格式不正确"
          return false
        }
      }

      // 执行到这里,说明校验通过
      reminderText.value = ""
      return true
    }
    // 验证码格式校验
    function checkCaptcha() {
      // 验证码
      if (captcha.captcha === "") {
        reminderText.value = "请输入验证码"
        return false
      } else if (captcha.captcha.length !== 4) {
        reminderText.value = "请输入完整验证码"
        return false
      }
      reminderText.value = ""
      return true
    }

    // 请求发送验证码短信
    function getCaptcha() {
      // 如果倒计时还没结束,就不允许重复发送验证码短信
      if (captcha.timeCount > 0) return

      // 手机号格式校验通过, 则发送验证码
      if (checkPhone()) {
        setCaptchaText()
        reqCaptcha(phone.value)
      }
    }

    // 校验验证码是否正确
    async function verifyCaptcha() {
      if (!(checkCaptcha() && checkPhone())) return

      // 如果验证码正确, 返回的result是 {code:200, data:true}
      let result = await reqCaptchaVerify({ phone: phone.value, captcha: captcha.captcha })
      if (result.data) {
        return result.data
      } else {
        reminderText.value = result.data
        return false
      }
    }

    // 登录或者退出登录
    async function logInOut() {
      if (user.value.userId) {
        await logout()
      } else {
        await login()
      }
      showLoginWindow.value = false
    }

    // 登录
    async function login() {
      // 验证手机和验证码格式
      if (!(checkCaptcha() && checkPhone())) return

      // 验证验证码的正误
      let captchaCorrect = await verifyCaptcha()
      if (!captchaCorrect) return

      let result = await reqLogin({ phone: phone.value, captcha: captcha.captcha })
      // 如果登录成功
      if (result.code === 200) {
        const { profile } = result
        store.commit("user/saveUser", { user: profile })
        getUserPlaylists()

        // 把用户信息保存在本地, 下次不用重复登录
        localStorage.setItem("PlayerUser", JSON.stringify(profile))
      }
    }

    // 获取用户歌单
    async function getUserPlaylists() {
      let result = await reqUserPlaylists(user.value.userId)
      if (result.code === 200) {
        // 去除歌单第一个, 因为访问它需要
        store.commit("user/saveUserPlaylists", { playlists: result.playlist })
      }
    }

    // 退出用户登录
    async function logout() {
      await reqLogout()
      // 清空用户信息
      store.commit("user/saveUser", { user: {} })
      store.commit("user/saveUserPlaylists", { playlists: [] })
      localStorage.setItem("PlayerUser", JSON.stringify({}))
    }

    //-----------------------------------关于本地存储用户信息----------------------------
    // 如果登录信息没有过期, 就直接读取保存在本地的用户信息
    if (checkLoginExpire()) {
      const localUserInfo = JSON.parse(localStorage.getItem("PlayerUser"))
      store.commit("user/saveUser", { user: localUserInfo })
      getUserPlaylists()
    }
    // 如果已经过期, 需要把本地的用户信息也清除
    else {
      localStorage.setItem("PlayerUser", JSON.stringify({}))
    }

    // 验证登录信息是否已经过期(检查cookie中是否有下面的3个条目)  没过期就返回true
    function checkLoginExpire() {
      const cookie = document.cookie
      return cookie.includes("__csrf") && cookie.includes("__remember_me") && cookie.includes("MUSIC_U")
    }

    return {
      showLoginWindow,
      phone,
      captcha,
      getCaptcha,
      reminderText,
      logInOut,
      user,
      getUserPlaylists,
      genImgURL,
    }
  },
}
</script>

<style lang="less" scoped>
@input-height: 35px;
.user {
  padding: 20px 18px;
  padding-bottom: 0;
  margin-bottom: 12px;
  .user-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      font-size: 21px;
      margin-right: 10px;
    }
    p {
      margin-left: 15px;
      font-size: 100%;
    }
    img {
      width: 40px;
      height: $width;
      border-radius: 50%;
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
      padding: 20px 30px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      background-color: var(--modal-bg-color);

      .title {
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

      .input-wrapper {
        position: relative;
        height: @input-height;
        margin-bottom: 30px;
        input {
          border: none;
          outline: none;
          width: 100%;
          height: @input-height;
          padding: 0 15px;
          border-radius: 4px;
          color: var(--header-input-color);
          background-color: var(--input-bgcolor);
        }
        .reminder {
          margin: 7px 0 0 10px;
          font-size: @font-size-sm;
          color: @theme-color;
        }
        .captcha-btn {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          width: 90px;
          height: 25px;
          line-height: $height;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 5px;
          text-align: center;
          font-size: @font-size-sm;
          color: var(--font-color-grey);
          cursor: pointer;
        }
      }
      .login-btn {
        width: 70%;
        height: 35px;
        margin: 45px auto 0;
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

&.fadeMove-enter-active,
.fadeMove-leave-active {
  transition: 0.25s;
}
.fadeMove-enter-from,
.fadeMove-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

.shake-enter-active {
  animation: shake 0.4s;
}
.shake-leave-active {
  transition: 0.3s;
}
.shake-leave-to,
.shake-enter-from {
  opacity: 0;
}

@keyframes shake {
  0% {
    transform: translateX(-2%);
  }
  25% {
    transform: translateX(1.5%);
  }
  50% {
    transform: translateX(-1%);
  }
  75% {
    transform: translateX(0.5%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>
