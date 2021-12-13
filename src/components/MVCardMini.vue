// 位于MV播放页面右侧的, 长方形小MV单元
<template>
  <div class="mv-card-mini">
    <div class="img-part">
      <img src="@/pages/MV/images/MVmini/1.jpg" alt="" />
      <PlayIcon :size="36"></PlayIcon>
      <div class="play-count"><i class="iconfont icon-bofang"></i> 2435</div>
      <div class="duration">05:19</div>
    </div>
    <div class="content">
      <div class="name">現状ディストラクション</div>
      <div class="desc">by SPYAIR</div>
    </div>
  </div>
</template>

<script>
import PlayIcon from "@/components/PlayIcon"
export default {
  components: { PlayIcon },
}
</script>

<style lang="less" scoped>
.mv-card-mini {
  display: flex;
  padding: 8px 0;
  border-radius: 4px;
  &:hover {
    background-color: var(--light-bgcolor);
  }
  .img-part {
    position: relative;
    margin-right: 8px;
    img {
      width: 140px;
      height: 76px;
      border-radius: 4px;
    }
    .play-count {
      position: absolute;
      top: 2px;
      right: 3px;
      color: @white;
      font-size: @font-size-sm;
      i {
        font-size: 100%;
      }
    }
    .duration {
      position: absolute;
      bottom: 5px;
      right: 3px;
      color: @white;
      font-size: @font-size-sm;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .name,
    .desc {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name {
      font-size: @font-size-medium-sm;
    }
    .desc {
      font-size: @font-size-sm;
      color: var(--font-color-grey-shallow);
    }
  }
}
</style>
