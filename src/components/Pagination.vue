// 页码器
<template>
  <div class="pagination" v-if="totalPageNum > 1">
    <div class="button left" @click="clickBtn('left')">
      <i class="iconfont icon-back"></i>
    </div>
    <div class="number-wrapper">
      <span class="number" :class="{ on: currentPage == 1 }" @click="clickNumer(1)">1</span>
      <!-- 左侧省略号 -->
      <span
        class="number"
        @click="clickEllip('left')"
        v-show="currentPage > 4 && totalPageNum > 7"
        ref="leftEllip"
        >...</span
      >
      <!-- 活动页码部分 -->
      <span
        class="number"
        v-for="(num, index) in variedPageNums"
        :key="index"
        :class="{ on: currentPage == num }"
        @click="clickNumer(num)"
        >{{ num }}</span
      >
      <!-- 右侧省略号 -->
      <span
        class="number"
        @click="clickEllip('right')"
        v-show="currentPage < totalPageNum - 3 && totalPageNum > 7"
        ref="rightEllip"
        >...</span
      >
      <span class="number" :class="{ on: currentPage == totalPageNum }" @click="clickNumer(totalPageNum)">{{
        totalPageNum
      }}</span>
    </div>
    <div class="button right" @click="clickBtn('right')">
      <i class="iconfont icon-next"></i>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, inject } from "vue"
export default {
  props: {
    totalPageNum: Number,
  },
  /*
    功能:
      1. 最左边页码始终为1,最右边页码始终为最后一页
      2. 活动的页码共有5个, 当前页码始终位于5个活动页码的第三个
          除非: 当前页码小于等于 1+3 或大于等于 最后页码-3
      3. 左省略号出现的条件: 当前页码大于 1+3
         右省略号出现的条件: 当前页码小于 最后页码-3
      4. 如果页码总数小于8, 那么就没有活动页码,所有的页码都是固定的
          也没有左右的省略号
  */
  setup(props) {
    // 当前页的页码,本组件核心变量,为了实现父子组件双向通信,该变量必须由父组件provide
    let currentPage = inject("currentPage")

    watch(currentPage, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        computePageNums()
      }
    })

    // 根据总页码数决定中间几个页码是活动页码还是固定页码
    let variedPageNums = reactive([2, 3, 4, 5, 6])
    function initVariedPageNums() {
      // 如果页码总数小于8,那中间的就不是活动页码,需要处理.否则不需要处理
      if (props.totalPageNum < 8) {
        // 左右两端的页码总是不变. 中间的页码的数量需要变化
        const pageNums = props.totalPageNum - 2
        // 重写variedPageNums数组
        variedPageNums.splice(0, 5)
        for (let i = 0; i < pageNums; i++) {
          variedPageNums.push(i + 2)
        }
      }
      // 如果总页数大于8,需要给variedPageNums重新赋值[2, 3, 4, 5, 6].
      // 因为可能上一首歌的评论总页码小于8, 改变了variedPageNums
      else {
        variedPageNums.length = 0
        variedPageNums = Object.assign(variedPageNums, [2, 3, 4, 5, 6])
      }
    }

    watch(
      () => props.totalPageNum,
      (newValue) => {
        if (newValue) {
          initVariedPageNums()
        }
      },
      { immediate: true }
    )

    //计算活动页码
    function computePageNums() {
      // 如果总页码数小于8, 那么中间的页码不变化
      if (props.totalPageNum < 8) return
      // 如果当前页码小于等于 1+3, 活动页码是2,3,4,5,6
      if (currentPage.value <= 4) {
        variedPageNums.forEach((value, index) => {
          variedPageNums[index] = index + 2
        })
      }
      // 如果当前页码大于等于 最后页码-3, 活动页码是最终页码往前依次数5
      else if (currentPage.value >= props.totalPageNum - 3) {
        variedPageNums.forEach((value, index) => {
          variedPageNums[index] = props.totalPageNum - (5 - index)
        })
      }
      // 其他情况下, 活动页码的中间那个是当前页的页码
      else {
        variedPageNums.forEach((value, index) => {
          variedPageNums[index] = currentPage.value - 2 + index
        })
      }
    }
    // 页码被点击后, 改变currentPage, 然后重新计算活动页码
    function clickNumer(num) {
      if (num === currentPage.value) {
        return
      }
      currentPage.value = num
    }
    // 点击左右省略号后, 当前页码+5或-5
    function clickEllip(dir) {
      if (dir === "left") {
        currentPage.value -= 5
      } else if (dir === "right") {
        currentPage.value += 5
      }
    }
    // 点击左右箭头,就将当前页码重置为首页或尾页
    function clickBtn(dir) {
      if (dir === "left") {
        currentPage.value = 1
      } else if (dir === "right") {
        currentPage.value = props.totalPageNum
      }
    }

    // 左右两个省略号, 在hover状态下变换成图标
    let leftEllip = ref(null)
    let rightEllip = ref(null)
    onMounted(() => {
      if (leftEllip.value && rightEllip.value) {
        handleEllips(leftEllip.value, "icon-zuozuo-")
        handleEllips(rightEllip.value, "icon-youyou-")
      }
    })
    function handleEllips(ele, fontName) {
      ele.onmouseenter = (event) => {
        event.target.innerHTML = ""
        event.target.classList.add("iconfont", fontName)
      }
      ele.onmouseleave = (event) => {
        event.target.innerHTML = "..."
        event.target.classList.remove("iconfont", fontName)
      }
    }

    return {
      variedPageNums,
      currentPage,
      clickNumer,
      clickEllip,
      clickBtn,
      leftEllip,
      rightEllip,
    }
  },
}
</script>

<style lang="less" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 32px;
  margin-bottom: 30px;
  font-weight: bold;
  color: var(--font-color);
  font-size: 13px;
  .button {
    margin: 0 12px;
    cursor: pointer;
    i {
      font-size: 100%;
    }
  }
  .number-wrapper {
    display: flex;
    .number {
      text-align: center;
      min-width: 27px;
      margin: 0 4px;
      cursor: pointer;
      &.on {
        color: @theme-color;
        cursor: default;
      }
    }
    .iconfont {
      font-size: 100%;
      font-weight: normal;
    }
  }
}
</style>
