// 用户评论的最小单元
<template>
  <div class="comment-card" :class="{ 'bottom-border': bottomBorder }">
    <img v-lazy="genImgURL(comment.user.avatarUrl, 80)" class="avatar" :key="comment.user.avatarUrl" />
    <div class="right-part">
      <div class="content">
        <span class="username">{{ comment.user.nickname }}: </span>
        <span class="comment">{{ comment.content }}</span>
      </div>
      <div class="quote-reply" v-if="comment.beReplied.length">
        <span class="username">{{ comment.beReplied[0].user.nickname }}: </span>
        <span class="comment">{{ comment.beReplied[0].content }}</span>
      </div>
      <div class="time-likes">
        <span class="time">{{ comment.timeStr }}</span>
        <span class="likes" @click="clickLike">
          <i class="iconfont icon-dianzan" ref="likeIcon"></i> {{ likesCountTemp }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import { genImgURL } from "@/utils/common"
export default {
  props: {
    comment: Object,
    bottomBorder: Boolean,
  },
  setup(props) {
    let likesCountTemp = ref(0)
    // 用户点赞后,向服务端发送post请求,但页面不重新加载,因为没有必要
    // 把用户点赞的评论的点赞数+1显示即可,同时改变点赞数图标的颜色
    likesCountTemp.value = props.comment.likedCount
    // 标记用户是否已经点赞, 如果没有,点赞+1;如果点了,就取消点赞,赞数恢复
    let hasClickedLike = false
    // 用以绑定点赞部分
    let likeIcon = ref(null)
    function clickLike() {
      // 如果没点过赞
      if (!hasClickedLike) {
        //post请求...
        likesCountTemp.value++
      }
      // 如果点过赞
      else {
        likesCountTemp.value = props.comment.likedCount
      }
      hasClickedLike = !hasClickedLike
      likeIcon.value.classList.toggle("has-been-clicked")
    }
    return { genImgURL, likesCountTemp, clickLike, likeIcon }
  },
}
</script>

<style lang="less" scoped>
.comment-card {
  display: flex;
  padding-top: 20px;
  font-size: @font-size-sm;
  .avatar {
    width: 40px;
    height: $width;
    margin-right: 12px;
    border-radius: 50%;
  }
  .right-part {
    flex: 1;
    padding-bottom: 20px;
    .content {
      margin-bottom: 8px;
    }
    .username {
      margin-right: 1px;
      color: @blue;
    }
    .comment {
      color: var(--font-color);
      line-height: 18px;
    }
    .time-likes {
      display: flex;
      justify-content: space-between;
      color: var(--font-color-grey-shallow);
      .likes {
        cursor: pointer;
        .iconfont {
          font-size: 100%;
        }
        .has-been-clicked {
          color: @theme-color;
        }
      }
    }

    .quote-reply {
      margin-bottom: 8px;
      padding: 8px;
      background: var(--song-shallow-grey-bg);
      border-radius: 5px;
    }
  }

  &.bottom-border {
    .right-part {
      border-bottom: 1px solid var(--border);
    }
  }
}
</style>
