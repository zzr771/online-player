// "推荐歌单"一级路由页
<template>
  <div class="rec-lists">
    <div class="top-card">
      <img src="./images/top.jpg" alt="" />
      <div class="content">
        <div class="tag">精品歌单</div>
        <p class="name">华语民谣 I 孤独的心诠释诗意和远方</p>
        <p class="description">
          民谣, 一听就是一个故事; 民谣, 唱的人普通, 听的人平凡; 民谣, 喜欢那种感同身受 热爱那些温柔辞藻.
          用歌曲说话, 用歌曲讲故事, 因为被赋予旋律, 所以才更容易打动人心. 简单的旋律和歌词,
          也可以传达出最饱含诗意的深情. 有时候, 民谣像是唱着漫长的一生, 却又像只是讲了某天放学后,
          暗恋少年阳光下灿烂的笑脸. 在民谣里回忆过去, 怀念过去的故事, 想念那些无法再见的人; 在民谣里憧憬未来,
          坚信有一天终将会抵达的远方. 因为有记忆, 我们变得丰满; 因为有向往, 我们才会一往无前. 即使有一天,
          我们白发苍苍, 但回首一生, 有那么多丰富的回忆和故事, 足矣. 愿孤独的你有诗的态度, 也有当下的远方.
        </p>
      </div>
    </div>
    <TabsBasic></TabsBasic>
    <div class="lists-wrapper">
      <ListCard v-for="(item, index) in 20" :key="index"></ListCard>
    </div>
    <Pagination :totalPageNum="20"></Pagination>
  </div>
</template>

<script>
import TabsBasic from "@/components/TabsBasic"
import ListCard from "@/components/ListCard"
import Pagination from "@/components/Pagination"
import { reactive, provide } from "vue"
export default {
  components: { TabsBasic, ListCard, Pagination },
  setup() {
    let tabs = reactive([
      { name: "全部", on: false },
      { name: "欧美", on: false },
      { name: "华语", on: false },
      { name: "流行", on: false },
      { name: "说唱", on: false },
      { name: "摇滚", on: false },
      { name: "民谣", on: false },
      { name: "电子", on: false },
      { name: "轻音乐", on: false },
      { name: "影视原声", on: false },
      { name: "ACG", on: false },
      { name: "怀旧", on: false },
      { name: "治愈", on: false },
      { name: "旅行", on: false },
    ])
    provide("tabs", tabs)
    return {}
  },
}
</script>

<style lang="less" scoped>
.rec-lists {
  padding: 12px;
}
.top-card {
  position: relative;
  z-index: 1;
  display: flex;
  height: 172px;
  border-radius: 5px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  /* 
    需求: 背景图模糊
    backdrop-filter在chrome有效,但在火狐浏览器无效,需要手动开启该功能 
    所以只能用filter来做. filter相当于加了一层遮罩在元素上面, 元素内部的所有东西都被影响
    但是filter不仅作用于本元素,还作用于本元素的子元素
      所以给父元素一个after伪子元素,在伪子元素内做背景模糊
  */
  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-image: url("./images/background.jpg");
    background-size: cover;
    filter: blur(20px) contrast(90%) brightness(0.7) drop-shadow(-15px -15px 1px rgba(0, 0, 0, 0.5));
  }
  img {
    margin-right: 8px;
  }
  .content {
    .tag {
      width: 90px;
      height: 26px;
      margin: 7px 0 16px;
      line-height: $height;
      text-align: center;
      color: @gold;
      border: 1px solid @gold;
      border-radius: 5px;
    }
    .name {
      margin-bottom: 8px;
      font-size: @font-size-lg;
      color: #fff;
    }
    .description {
      height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: @font-size-sm;
      color: var(--font-color-grey-shallow);
    }
  }
}
.lists-wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>
