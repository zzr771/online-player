export default function LyricPaser(lrc) {
  // 如果有译文歌词, 说明原文是外文. 译文歌词也需要解析
  if (lrc.tlyric.lyric.length) {
    const foreignLrcArr = parseLyric(lrc.lrc.lyric)
    const chineseLrcArr = parseLyric(lrc.tlyric.lyric)
    // 把译文歌词添加进foreignLrcArr中
    lyricMix(foreignLrcArr, chineseLrcArr)
    return foreignLrcArr
  }
  // 原文为中文, 只有中文歌词需要解析
  else {
    const chineseLrc = parseLyric(lrc.lrc.lyric)
    return chineseLrc
  }
}

function parseLyric(lrc) {
  let lyricObjs = [] //最终返回的结果

  let lyricArr = []
  lyricArr = lrc.split("\n")
  // 如果字符串lrc最后一个字符是"\n", split方法会把"\n"后面不存在的内容也拆分出一个空字符串保存在lyricArr中. 所以要去除
  if (lyricArr[lyricArr.length - 1] === "") lyricArr.pop()
  // 时间正则表达式
  const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g
  // 匹配获取:和.前后的时间,从而获得时,分,秒
  const timePartReg = /\[(?:(\d*):)?(\d*):(\d*)\.(\d*)*\]/g

  lyricArr.forEach((lyric) => {
    // 获取本句歌词的时间
    let time = lyric.match(timeReg)
    // 有的中文歌词的开头会有一些译者笔名之类的信息,并不包含时间. 这些信息就不展示, 一面干扰效果
    if (!time) return
    // 获取本句歌词的内容
    const content = lyric.replace(time[0], "")
    // 获得把时间拆分后的结果
    let timeParts = timePartReg.exec(time[0])
    // 必须重置为0. 否则下一次查找出错
    timePartReg.lastIndex = 0
    /*  
        正则表达式timePartReg在time中执行匹配后,返回结果的结构为: 
        如果 time= "[03:28.336]", 返回结果为
        ["[03:28.336]", undefined, "03", "28", "336"]
        如果 time= "[01:03:28.336]", 返回结果为
        ["[01:03:28.336]", "01", "03", "28", "336"]
        所以,看索引为1的元素是不是undefined,就知道hour是不是为0
    */
    const [, hour, min, sec, msec] = timeParts
    // 时间转化为秒
    const totelTime = Number(hour ? hour * 3600 : 0) + Number(min * 60) + Number(sec) + Number(msec / 1000)

    lyricObjs.push({ time: totelTime, contents: [content] })
  })
  return lyricObjs
}

// 整合外文歌词和译文歌词. 把译文歌词添加进foreignLrcArr中
function lyricMix(foreignLrcArr, chineseLrcArr) {
  foreignLrcArr.forEach((fl) => {
    const sameLyric = chineseLrcArr.find((cl) => {
      return cl.time === fl.time
    })
    // 如果找到了时间相同的译文歌词,就把歌词添加进fl中. 没找到就什么都不做
    if (sameLyric) {
      fl.contents.push(sameLyric.contents[0])
    }
  })
}
