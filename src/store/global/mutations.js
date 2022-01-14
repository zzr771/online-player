export default {
  updatePreviousPositions(state, { routeName, position }) {
    const previousPosition = state.previousPositions.find((p) => {
      return p.routeName === routeName
    })
    if (previousPosition) {
      previousPosition.position = position
    } else {
      state.previousPositions.push({ routeName, position })
    }
  },
  setreqErrMsg(state, { msg }) {
    state.reqErrMsg = msg
  },

  // 显示loading
  showLoading(state) {
    state.showLoading = 1
  },

  // 根据value值, 决定是否隐藏loading
  hideLoading(state, { value }) {
    // 如果是一般请求
    if (value === 1) {
      state.showLoading = 0
    }
    // 如果是"discovery"页面的请求
    else {
      state.showLoadingCount += value
      // 当4个请求都完成时
      if (state.showLoadingCount === 1) {
        state.showLoading = 0
        state.showLoadingCount = 0
      }
    }
  },
}
