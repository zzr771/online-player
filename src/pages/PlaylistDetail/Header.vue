<template>
  <div class="header">
    <div class="img-wrap">
      <img :src="genImgURL(playlist.coverImgUrl, 400)" />
    </div>
    <div class="content">
      <p class="title">{{ playlist.name }}</p>
      <div class="creator-wrap">
        <img :src="genImgURL(playlist.creator.avatarUrl, 60)" class="avatar" />
        <p class="creator">{{ playlist.creator.nickname }}</p>
        <p class="create-time">{{ new Date(playlist.createTime).toLocaleString().split(" ")[0] }} 创建</p>
      </div>
      <div class="action-wrap">
        <div class="button">
          <i class="iconfont icon-bofang"></i>
          <span class="middle" @click="playAll">播放全部</span>
        </div>
      </div>
      <div class="desc-wrap">
        <p class="tag">
          标签：<span v-for="(tag, index) in playlist.tags" :key="index">{{ tag }}</span>
        </p>
        <div class="desc" ref="desc">
          简介：{{ playlist.description }}
          <div class="full-text-btn" v-if="heightOverflow" @click="toggleShowFullText">
            {{ showFullText ? "收起" : "全文" }}
          </div>
        </div>
        <!-- 用于测量文本总高度, 不显示 -->
        <div class="full-desc" ref="fullDesc">简介： {{ playlist.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayIcon from "@/components/PlayIcon"
import { genImgURL } from "@/utils/common"
import { ref, onMounted, inject } from "vue"
export default {
  props: {
    playlist: Object,
  },
  setup() {
    const desc = ref(null)
    const fullDesc = ref(null)
    let heightOverflow = ref(false) // 总文本高度是否溢出
    let showFullText = ref(false)

    onMounted(() => {
      let totalHeight = fullDesc.value.offsetHeight
      // 如果全部文本的高度大于58px, 则需要使用"全文"按钮
      if (totalHeight > 58) {
        heightOverflow.value = true
      }
    })

    function toggleShowFullText() {
      showFullText.value = !showFullText.value
      desc.value.classList.toggle("show-full-text")
    }

    const playAll = inject("playAll")

    return { genImgURL, desc, fullDesc, showFullText, heightOverflow, toggleShowFullText, playAll }
  },
  components: { PlayIcon },
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  padding: 36px 36px 12px;

  .img-wrap {
    width: 200px;
    height: 200px;
    margin-right: 24px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .title {
      margin-bottom: 12px;
      font-size: @font-size-lg;
      color: var(--font-color-white);
    }

    .action-wrap {
      margin-bottom: 15px;
      .button {
        width: 140px;
        padding: 5px 16px;
        border: 1px solid @theme-color;
        border-radius: 5px;
        color: @theme-color;
        text-align: center;
        cursor: pointer;
        transition: 0.25s;
        &:hover {
          background-color: @theme-color;
          color: @white;
        }
        i {
          font-size: @font-size;
          margin-right: 6px;
        }
        .middle {
          vertical-align: middle;
        }
      }
    }

    .creator-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 18px;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .creator {
        margin-right: 8px;
      }
      .create-time {
        font-size: @font-size-sm;
      }
    }

    .desc-wrap {
      position: relative;
      margin-bottom: 8px;
      font-size: @font-size-medium-sm;
      .tag {
        margin-bottom: 5px;
        span {
          margin-right: 10px;
        }
      }
      .desc,
      .full-desc {
        line-height: 1.5;
      }
      .full-desc {
        position: absolute;
        z-index: -10;
        color: transparent;
      }
      .desc {
        position: relative;
        max-height: 58px;
        overflow: hidden;
        &.show-full-text {
          max-height: none;
          .full-text-btn {
            bottom: 0px;
          }
        }
        .full-text-btn {
          position: absolute;
          right: 0;
          bottom: -1px;
          padding-left: 30px;
          background: linear-gradient(to right, transparent, var(--body-bgcolor) 30%);
          color: @blue;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
