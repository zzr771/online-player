// 用户评论区, 包含"精彩评论"和"最新评论"两个分区
<template>
  <div class="comments" ref="commentsWrapper">
    <div class="hot-comments" v-if="hotCommentsNum && currentPage === 1">
      <p class="title">精彩评论</p>
      <CommentCard
        v-for="(hotComment, index) in hotComments"
        :comment="hotComment"
        :bottomBorder="index !== Object.keys(hotComments).length - 1"
        :key="index"
      ></CommentCard>
    </div>
    <div class="new-comments">
      <p class="title">最新评论 ({{ total }})</p>
      <CommentCard
        v-for="(newComment, index) in comments"
        :comment="newComment"
        :bottomBorder="index !== Object.keys(comments).length - 1"
        :key="index"
      ></CommentCard>
    </div>
    <Pagination :totalPageNum="totalPageNum"></Pagination>
  </div>
</template>

<script>
import CommentCard from "./CommentCard"
import Pagination from "@/components/Pagination"
import { ref, reactive, provide, watch } from "vue"
import { reqSongComment, reqPlaylistComment, reqMvComment, reqHotComment } from "@/api/comment"

const PAGE_SIZE = 20
export default {
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator(value) {
        // 这个值必须与下列字符串中的其中一个相匹配
        return ["song", "playlist", "mv"].includes(value)
      },
    },
  },
  setup(props) {
    // 页码器的当前页码
    let currentPage = ref(1)
    // 更新页码的函数
    function updateCurrentPage(page) {
      currentPage.value = page
    }
    provide("updateCurrentPage", updateCurrentPage)

    const reqFunctions = {
      song: reqSongComment,
      playlist: reqPlaylistComment,
      mv: reqMvComment,
    }

    let comments = reactive({}) //普通评论
    let hotComments = reactive({}) //热评
    let total = ref(0) //评论总数
    let hotCommentsNum = ref(0) //热评数量. 用于判断是否展示热评
    let totalPageNum = ref()
    async function getComments() {
      const req = reqFunctions[props.type]
      const {
        comments: _comments,
        hotComments: _hotComments,
        total: _total,
      } = await req({
        id: props.id,
        pageSize: PAGE_SIZE,
        offset: (currentPage.value - 1) * PAGE_SIZE,
      })

      comments = Object.assign(comments, _comments)
      hotComments = Object.assign(hotComments, _hotComments)
      total.value = _total

      hotCommentsNum.value = Object.keys(hotComments).length
      totalPageNum.value = Math.ceil(total.value / 20)
    }
    getComments()

    // 监视id, 如果变化,就要重新请求评论
    watch(
      () => props.id,
      (newValue) => {
        if (newValue) {
          currentPage.value = 1
          getComments()
        }
      }
    )

    // 监视currentPage,如果换页,就要请求新一页的评论内容,并且自动滚动到评论区顶端
    let commentsWrapper = ref(null)
    async function onPageChange() {
      await getComments()
      commentsWrapper.value.scrollIntoView({ behavior: "smooth" })
    }
    watch(currentPage, onPageChange)

    return { comments, hotComments, total, currentPage, hotCommentsNum, totalPageNum, commentsWrapper }
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
