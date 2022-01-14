export default {
  // keep-alive路由页面的之前滚动位置
  previousPositions: [],
  // 请求出错时的错误信息
  reqErrMsg: "",

  // 是否显示全局loading(转圈的加载中图标)  值为1则显示loading,值为0则隐藏
  showLoading: 0,
  // "discovery"页面请求的计数器, 每完成一个请求, 加0.25. 等于1时说明全部请求都完成
  showLoadingCount: 0,
}
