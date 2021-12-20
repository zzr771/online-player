/* 当要跳转的路由页的autoTop属性为true时, 使该路由页滚动到顶部

    但是, 路由页是包含在一个id="content"的元素内部的,所以,
      设置 window.scrollTo(0,0) 或者 document.body.scrollTop = 0
      或者 document.documentElement.scrollTop = 0 都无效.
      因为body没有滚动, content元素才是滚动发生的容器
    所以要把content的scrollTop置为0

   当要跳转到开启keep-alive的页面时,使页面内容自动滚动到上次的位置
  */
const store = useStore()
const contentDiv = document.getElementById("content")
router.afterEach((to, from) => {
  if (to.meta.autoTop) {
    contentDiv.scrollTop = 0
    return
  }
  if (to.meta.keepAlive) {
    const previousPositions = store.state.globle.previousPositions
    const previousPosition = previousPositions.find((p) => {
      return (p.routeName = to.name)
    })
    // 如果previousPosition存在
    if (previousPosition) {
      contentDiv.scrollTop = previousPosition.position
    }
  }
})
// 离开keepAlive路由之前,保存页面滚动位置
router.beforeEach((to, from, next) => {
  if (from.meta.keepAlive) {
    const position = contentDiv.scrollTop
    store.commit("global/updatePreviousPositions", { routeName: from.name, position })
  }
  next()
})
