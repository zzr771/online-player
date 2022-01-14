// 用户评论区, 包含"精彩评论"和"最新评论"两个分区
<template>
  <div class="comments" ref="commentsWrapper">
    <div class="hot-comments" v-if="comments.hotComments && currentPage === 1">
      <p class="title">精彩评论</p>
      <CommentCard
        v-for="(hotComment, index) in comments.hotComments"
        :comment="hotComment"
        :bottomBorder="index !== comments.hotComments.length - 1"
        :key="index"
      ></CommentCard>
    </div>
    <div class="new-comments">
      <p class="title">最新评论 ({{ total }})</p>
      <CommentCard
        v-for="(newComment, index) in comments.all"
        :comment="newComment"
        :bottomBorder="index !== comments.all.length - 1"
        :key="index"
      ></CommentCard>
    </div>
    <Pagination :totalPageNum="totalPageNum"></Pagination>
    <div class="loading-wrapper" v-if="showMiniLoading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="45px"
        height="45px"
        viewBox="0 0 40 40"
        enable-background="new 0 0 40 40"
        xml:space="preserve"
      >
        <path
          opacity="0.2"
          fill="#FF6700"
          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
      s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
      c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
        ></path>
        <path
          fill="#d33a31"
          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
      C22.32,8.481,24.301,9.057,26.013,10.047z"
          transform="rotate(42.1171 20 20)"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.5s"
            repeatCount="indefinite"
          ></animateTransform>
        </path>
      </svg>
    </div>
  </div>
</template>

<script>
import CommentCard from "./CommentCard"
import Pagination from "@/components/Pagination"
import { ref, reactive, provide, watch } from "vue"
import { reqSongComment, reqPlaylistComment, reqMvComment } from "@/api/comment"

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
        // type的值必须与下列字符串中的其中一个相匹配
        return ["song", "playlist", "mv"].includes(value)
      },
    },
  },
  setup(props) {
    let currentPage = ref(1) // 页码器的当前页码
    provide("currentPage", currentPage)
    let showMiniLoading = ref(false) //是否显示Loading图标

    const reqFunctions = {
      song: reqSongComment,
      playlist: reqPlaylistComment,
      mv: reqMvComment,
    }

    let comments = reactive({ hotComments: [], all: [] }) //评论,包含热门评论和所有评论
    let total = ref(0) //评论总数
    let totalPageNum = ref()
    async function getComments() {
      // 显示loading
      showMiniLoading.value = true

      const req = reqFunctions[props.type]
      let {
        comments: _comments,
        hotComments: _hotComments,
        total: _total,
      } = await req({
        id: props.id,
        pageSize: PAGE_SIZE,
        offset: (currentPage.value - 1) * PAGE_SIZE,
      })

      comments.all = _comments
      comments.hotComments = _hotComments
      total.value = _total
      totalPageNum.value = Math.ceil(total.value / 20)

      // 隐藏loading
      showMiniLoading.value = false
    }

    // 监视id, 如果变化,就要重新请求评论
    watch(
      () => props.id,
      (newValue) => {
        if (newValue) {
          currentPage.value = 1

          getComments()
        }
      },
      { immediate: true }
    )

    // 监视currentPage,如果换页,就要请求新一页的评论内容,并且自动滚动到评论区顶端
    let commentsWrapper = ref(null)
    async function onPageChange() {
      setTimeout(() => {
        commentsWrapper.value.scrollIntoView({ behavior: "smooth" })
      })

      getComments()
    }
    watch(currentPage, onPageChange)

    return { comments, total, currentPage, totalPageNum, commentsWrapper, showMiniLoading }
  },
  components: {
    CommentCard,
    Pagination,
  },
}
</script>

<style lang="less" scoped>
.comments {
  position: relative;
  .hot-comments,
  .new-comments {
    margin-bottom: 48px;
  }
  .title {
    font-size: @font-size-lg;
    font-weight: bold;
    margin-bottom: 4px;
  }
  .loading-wrapper {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
