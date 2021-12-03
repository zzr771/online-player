<template>
  <div class="comments">
    <div class="hot-comments" v-if="comments.hotComments">
      <p class="title">精彩评论</p>
      <CommentCard
        v-for="(hotComment, index) in comments.hotComments"
        :comment="hotComment"
        :bottomBorder="index !== comments.hotComments.length - 1"
        :key="index"
      ></CommentCard>
    </div>
    <div class="new-comments">
      <p class="title">最新评论 ({{ totalCommentNum }})</p>
      <CommentCard
        v-for="(newComment, index) in comments.newComments"
        :comment="newComment"
        :bottomBorder="index !== comments.newComments.length - 1"
        :key="index"
      ></CommentCard>
    </div>
    <Pagination :totalPageNum="26"></Pagination>
  </div>
</template>

<script>
import CommentCard from "./CommentCard"
import Pagination from "@/components/Pagination"
import { computed } from "vue"
export default {
  setup() {
    const comments = {
      hotComments: [
        {
          username: "EzekielDaun",
          avatar: require("@/pages/MV/images/comments/1.jpg"),
          content:
            "血小板都没能让我氪大会员，这番果断剁了开追[爱心]血小板都没能让我氪大会员，这番果断剁了开追[爱心]血小板都没能让我氪大会员，这番果断剁了开追[爱心]血小板都没能让我氪大会员，这番果断剁了开追[爱心]",
          time: "2018-10-13 16:48:57",
          likesCount: 1617,
          quoteReply: {},
        },
        {
          username: "AzusaHana",
          avatar: require("@/pages/MV/images/comments/2.jpg"),
          content: "残念，全部猜错，建议去补原作",
          time: "2018-10-26 20:22:31",
          likesCount: 926,
          quoteReply: {
            username: "TheLo-Fi",
            content:
              "就op给的信息来说，这个作者没胆量不给男主人形，也不打算搞一只母史莱姆当女主，就知道这部番虽然开头有些创意，后期还是传统的打怪收后宫套路。",
          },
        },
        {
          username: "黎岸丶繁漪",
          avatar: require("@/pages/MV/images/comments/3.jpg"),
          content: "遇事不决，量子力学，双叶一下，你就知道！",
          time: "2019-01-18 19:25:03",
          likesCount: 352,
          quoteReply: {},
        },
      ],
      newComments: [
        {
          username: "找点啥老弟",
          avatar: require("@/pages/MV/images/comments/4.jpg"),
          content: "或许“开头有些创意”是猜对了？毕竟....看过的都懂",
          time: "2021-10-31 20:03:33",
          likesCount: 0,
          quoteReply: {
            username: "AzusaHana",
            content: "残念，全部猜错，建议去补原作",
          },
        },
        {
          username: "十月底的晚秋",
          avatar: require("@/pages/MV/images/comments/5.jpg"),
          content: "哈哈哈大G的SG，洋次郎弹会心一击用的那把吉他",
          time: "2021-10-23 20:16:34",
          likesCount: 0,
          quoteReply: {
            username: "帐号已注销",
            content: "RADWIMPS...有内味了",
          },
        },
      ],
    }
    let totalCommentNum = computed(() => {
      return comments.hotComments.length + comments.newComments.length
    })
    return { comments, totalCommentNum }
  },
  components: {
    CommentCard,
    Pagination,
  },
}
</script>

<style lang="less" scoped>
.hot-comments,
.new-comments {
  margin-bottom: 48px;
}
.title {
  font-size: @font-size-lg;
  font-weight: bold;
  margin-bottom: 4px;
}
</style>
