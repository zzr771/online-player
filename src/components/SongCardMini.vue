<template>
  <div class="song-card-mini">
    <div class="img-part">
      <img src="@/assets/images/1.jpg" alt="" />
      <PlayIcon :size="24"></PlayIcon>
    </div>
    <div class="right">
      <p class="name">When We Were Young YoungYoungYoung</p>
      <p class="desc">
        <slot></slot>
      </p>
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
.song-card-mini {
  display: flex;
  padding: 0 4px;
  margin-bottom: 6px;
  .img-part {
    position: relative;
    width: 50px;
    height: $width;
    border-radius: 4px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-left: 8px;
    overflow: hidden;
    .name {
      width: 100%;
      font-size: @font-size-medium-sm;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .desc {
      font-size: @font-size-sm;
      color: var(--font-color-grey-shallow);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
