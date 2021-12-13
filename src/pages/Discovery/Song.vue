// "发现音乐"页面中的"最新音乐"组件
<template>
  <div class="new-songs">
    <TitleH2 title="最新音乐"></TitleH2>
    <ul class="songs-wrapper">
      <li class="song" v-for="(item, index) in 10" :key="index">
        <p class="left">{{ index }}</p>
        <div class="middle">
          <img src="./images/songs/1.jpg" alt="" />
          <PlayIcon :size="24"></PlayIcon>
        </div>
        <div class="right">
          <p class="song-name">At Least I Had You</p>
          <p class="singer">Gentle Bones / 林俊杰</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import TitleH2 from "@/components/TitleH2"
import PlayIcon from "@/components/PlayIcon"
export default {
  components: { TitleH2, PlayIcon },
}
</script>

<style lang="less" scoped>
.new-songs {
  margin-bottom: 30px;
}

.songs-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 420px;
  font-size: @font-size-sm;
  .song {
    display: flex;
    width: 50%;
    height: 20%;
    padding: 8px;
    border-radius: 10px;
    &:hover {
      background-color: var(--light-bgcolor);
    }
    .left {
      width: 30px;
      margin-right: 8px;
      text-align: center;
      line-height: 68px;
    }
    .middle {
      position: relative;
      display: flex;
      width: 68px;
      height: $width;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}
</style>
