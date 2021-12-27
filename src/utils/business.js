// 本文件保存业务处理方法
export function standardizeSongObj(song) {
  const { id, name, img, artists, duration, albumId, albumName, albumImg, mvId, ...rest } = song

  return {
    id,
    name,
    img,
    artists,
    url: genSongPlayUrl(song.id),
    artistsText: genArtistsText(artists),
    durationSecond: duration / 1000,
    albumName,
    albumId,
    albumImg,
    mvId,
    // 该歌曲是否正在播放
    isPlaying: false,
    ...rest,
  }
}
function genSongPlayUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}
function genArtistsText(artists) {
  const nameArr = (artists || []).map((artist) => artist.name)
  return nameArr.join(" / ")
}
