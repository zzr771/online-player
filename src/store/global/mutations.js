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
}
