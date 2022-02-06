export default {
  // mutations的唯一目的是修改state中的值
  // mutations中的每个方法功能应尽量单一
  addCounter(state, payload) {
    payload.count++
  },
  addToCart(state, payload) {
    payload.checked = false
    state.cartList.push(payload)
  }
}