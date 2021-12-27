<template>
  <div class="song-card-mini" @click="onCLick">
    <div class="img-part">
      <img :src="imgUrl" alt="" />
      <PlayIcon :size="24"></PlayIcon>
    </div>
    <div class="right">
      <p class="name">{{ data.name }}</p>
      <p class="desc">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue"
import { useStore } from "vuex"
import PlayIcon from "@/components/PlayIcon"
import { genImgURL } from "@/utils/common"

export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: {},
    },
    type: {
      type: [Number, String],
      required: true,
      validator(value) {
        // 这个值必须与下列字符串中的其中一个相匹配
        return ["song", "playlist"].includes(value)
      },
    },
  },
  setup(props) {
    const store = useStore()

    let imgUrl = ref("")
    if (props.type === "song") {
      imgUrl = genImgURL(props.data.img, 100)
    } else if (props.type === "playlist") {
      imgUrl = genImgURL(props.data.coverImgUrl, 100)
    }

    function onCLick() {
      if (props.type === "song") {
        store.dispatch("music/startSong", props.data)
      } else if (props.type === "playlist") {
        alert("需先完成登录功能")
      }
    }
    return { onCLick, imgUrl }
  },
  components: { PlayIcon },
}
</script>

<style lang="less" scoped>
.song-card-mini {
  display: flex;
  padding-right: 6px;
  margin-bottom: 8px;
  border-radius: 4px;
  &:hover {
    background-color: var(--menu-item-hover-bg);
  }
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
      cursor: pointer;
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
