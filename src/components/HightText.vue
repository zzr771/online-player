<template>
  <div class="highlight-text">
    {{ left }}<span class="hightlight">{{ keywordInText }}</span
    >{{ right }}{{ artistsText }}
  </div>
</template>

<script>
import { ref, watchEffect } from "vue"
export default {
  props: {
    text: String,
    keyword: String,
    artists: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    let left = ref("")
    let right = ref("")
    // 不知道text中的关键词和keyword的大小写是否一致,所以只能提取出text中的原文进行高亮
    let keywordInText = ref("")
    let artistsText = ref("")

    watchEffect(() => {
      // 搜索字符串之前全部转为小写
      let lowerText = props.text.toLowerCase()
      let lowerKeyword = props.keyword.toLowerCase().trim()

      let startIndex = lowerText.indexOf(lowerKeyword)
      let endIndex = startIndex + lowerKeyword.length

      left.value = props.text.slice(0, startIndex)
      right.value = props.text.slice(endIndex)
      keywordInText.value = props.text.slice(startIndex, endIndex)
      artistsText.value = genArtistsText()
    })

    function genArtistsText() {
      if (!props.artists.length) return

      let nameArr = props.artists.map((artist) => artist.name)
      return " - " + nameArr.join(" / ")
    }

    return { left, right, keywordInText, artistsText }
  },
}
</script>

<style lang="less" scoped>
.highlight-text {
  width: 100%;
  padding: 12px 24px;
  font-size: @font-size-sm;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background: var(--light-bgcolor);
  }
  .hightlight {
    color: @blue;
  }
}
</style>
