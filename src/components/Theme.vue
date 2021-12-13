// 位于header右侧, 加载和切换主题色的组件
<template>
  <div class="theme">
    <span class="icon-wrapper" @click="showOptionsFn"><i class="iconfont icon-pifu"></i></span>
    <div class="options" v-show="showOptions">
      <div
        class="option"
        v-for="(themeValue, themeKey, index) in themes"
        :key="index"
        @click="changeTheme(themeValue)"
      >
        <div class="icon" :style="themeValue.style"></div>
        <p>{{ themeValue.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import variablesWhite from "@/style/themeColors/variables-white"
import variablesRed from "@/style/themeColors/variables-red"
import variablesDark from "@/style/themeColors/variables-dark"
import { ref, onBeforeMount } from "vue"
export default {
  setup() {
    let showOptions = ref(false)
    let themes = {
      white: {
        title: "白色",
        file: variablesWhite,
        style: {
          backgroundColor: "#F6F6F6",
          border: "1px solid #eee",
        },
      },
      red: {
        title: "红色",
        file: variablesRed,
        style: {
          backgroundColor: "#D33A31",
        },
      },
      dark: {
        title: "深色",
        file: variablesDark,
        style: {
          backgroundColor: "#202020",
        },
      },
    }
    let localTheme = JSON.parse(localStorage.getItem("theme"))
    // 加载主题css变量
    onBeforeMount(() => {
      // 如果用户之前选取了主题皮肤,那么就从本地存储里读取用户选的是哪个主题,并加载
      if (localTheme) {
        changeTheme(localTheme)
      } else {
        // 如果用户之前没有选取过主题色,那么默认白色主题
        changeTheme(themes.white)
      }
    })
    // 读取变量文件中的所有css变量,赋值给根元素(html)
    function changeTheme(theme) {
      localStorage.setItem("theme", JSON.stringify(theme))
      const variables = theme.file
      Object.keys(variables).forEach((key) => {
        const value = variables[key]
        document.documentElement.style.setProperty(key, value)
      })
    }

    // 下面的部分处理选项卡显示/隐藏功能
    // 隐藏功能: 点击选项卡以外的任何地方,都会隐藏选项卡,同时该次点击能正常触发被点击元素上的回调
    function showOptionsFn() {
      /*
       如果选项卡是隐藏状态,就给document的点击事件添加一个回调,该回调触发后隐藏选项卡.
       这样, 点击页面的任何地方,最终会通过冒泡触发document身上的这个回调
       但是document的范围太广,也包含了选项卡本身以及皮肤图标.它们也会获得这个回调.
       为了不让这两个东西也触发回调,就得给阻止它们身上的事件冒泡
       但是这么做有个弊端: 如果其他元素身上阻止了冒泡,那么就不能触发这个关闭选项卡的回调

       这里开发出了一种完美的解决办法: 在点击事件的回调中,检查点击事件的触发元素(event.target)是否是
        <div class='theme'>...</div> 的子元素. 如果是,则继续展示选项卡,如果不是,就隐藏选项卡
      */

      // 先移除toggleshowOptions回调,防止多次点击皮肤图标后,该回调被添加多次
      document.removeEventListener("click", toggleShowThemeOptions)
      document.addEventListener("click", toggleShowThemeOptions)
    }
    // 单独拆出一个函数是为了能够使用removeEventListener
    function toggleShowThemeOptions(event) {
      let theme = document.querySelector(".theme")
      // pn先保存触发点击事件的父节点, 在循环中不断替换为更上一级的父节点
      let pn = event.target.parentNode
      // 循环到 pn等于html为止
      while (pn !== document.documentElement) {
        if (pn === theme) {
          showOptions.value = true
          return
        }
        pn = pn.parentNode
      }
      // 如果函数执行到这里,说明被点击的元素不是theme的后代元素,就隐藏选项卡
      showOptions.value = false
      // 最后移除回调,防止每次点击页面都执行该回调
      document.removeEventListener("click", toggleShowThemeOptions)
    }
    return { themes, changeTheme, showOptions, showOptionsFn }
  },
}
</script>

<style lang="less" scoped>
.theme {
  position: relative;
  display: flex;
  .icon-wrapper {
    width: 25px;
    height: $width;
    line-height: $width;
    text-align: center;
    border-radius: 50%;
    transition: 0.3s;
    &:hover {
      background-color: var(--round-hover-bgcolor);
    }
    i {
      color: var(--header-font-color);
    }
  }
  .options {
    position: absolute;
    z-index: 1000;
    top: 35px;
    left: -180px;
    display: flex;
    justify-content: space-evenly;
    width: 230px;
    padding: 13px;
    border-radius: 5px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    background-color: var(--prompt-bg-color);
    // 箭头
    &::before {
      content: "";
      position: absolute;
      top: -8px;
      left: 184px;
      border: solid 8px;
      border-top: none;
      border-color: transparent transparent var(--prompt-bg-color) transparent;
    }
    .option {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      .icon {
        width: 25px;
        height: $width;
        border-radius: 50%;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
