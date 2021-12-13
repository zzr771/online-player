// 页码器
<template>
  <div class="pagination">
    <div class="button left" @click="clickBtn('left')">
      <i class="iconfont icon-back"></i>
    </div>
    <div class="number-wrapper">
      <span class="number" :class="{ on: currentPage == 1 }" @click="clickNumer(1)">1</span>
      <span class="number" @click="clickEllip('left')" v-show="currentPage > 4" id="leftEllip">...</span>
      <!-- 活动页码部分 -->
      <span
        class="number"
        v-for="(num, index) in variedPageNums"
        :key="index"
        :class="{ on: currentPage == num }"
        @click="clickNumer(num)"
        >{{ num }}</span
      >

      <span
        class="number"
        @click="clickEllip('right')"
        v-show="currentPage < totalPageNum - 3"
        id="rightEllip"
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
import { ref, reactive, onMounted } from "vue"
export default {
  props: {
    totalPageNum: Number,
  },
  /*
    需求:
      1. 最左边页码始终为1,最右边页码始终为最后一页
      2. 活动的页码共有5个, 当前页码始终位于5个活动页码的第三个
          除非: 当前页码小于等于 1+3 或大于等于 最后页码-3
      3. 左省略号出现的条件: 当前页码大于 1+3
         右省略号出现的条件: 当前页码小于 最后页码-3
  */
  setup(props) {
    // 当前页的页码
    let currentPage = ref(1)
    let variedPageNums = reactive([2, 3, 4, 5, 6])

    //计算活动页码
    function computePageNums() {
      // 如果当前页码小于等于 1+3, 活动页码是2,3,4,5,6
      if (currentPage.value <= 4) {
        variedPageNums.forEach((value, index) => {
          variedPageNums[index] = index + 2
        })
        // console.log("前", variedPageNums)
      }
      // 如果当前页码大于等于 最后页码-3, 活动页码是最终页码往前数5
      else if (currentPage.value >= props.totalPageNum - 3) {
        variedPageNums.forEach((value, index) => {
          variedPageNums[index] = props.totalPageNum - (5 - index)
        })
        // console.log("后", variedPageNums)
      }
      // 其他情况下, 活动页码的中间那个是当前页的页码
      else {
        variedPageNums.forEach((value, index) => {
          variedPageNums[index] = currentPage.value - 2 + index
        })
        // console.log("中", variedPageNums)
      }
    }
    // 页码被点击后, 改变currentPage, 然后重新计算活动页码
    function clickNumer(num) {
      if (num === currentPage.value) {
        return
      }
      currentPage.value = num
      computePageNums()
    }
    // 点击左右省略号后, 当前页码+5或-5
    function clickEllip(dir) {
      if (dir === "left") {
        currentPage.value -= 5
      } else if (dir === "right") {
        currentPage.value += 5
      }
      computePageNums()
    }
    // 点击左右箭头,就将当前页码重置为首页或尾页
    function clickBtn(dir) {
      if (dir === "left") {
        currentPage.value = 1
      } else if (dir === "right") {
        currentPage.value = props.totalPageNum
      }
      computePageNums()
    }

    // 左右两个省略号, 在hover状态下变换成图标
    onMounted(() => {
      const leftEllip = document.getElementById("leftEllip")
      const rightEllip = document.getElementById("rightEllip")
      handleEllips(leftEllip, "icon-zuozuo-")
      handleEllips(rightEllip, "icon-youyou-")
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

    return { variedPageNums, currentPage, clickNumer, clickEllip, clickBtn }
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
