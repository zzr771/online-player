export default {
  // 保存用户信息
  saveUser(state, { user }) {
    state.user = user
  },
  // 保存用户歌单
  saveUserPlaylists(state, { playlists }) {
    state.userPlaylists = playlists
  },
}
