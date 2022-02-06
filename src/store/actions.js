export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // payload新添加的商品是否已经在购物车
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 如果已经在购物车 数量+1即可，如果没在购物车，数量设为1，并加入购物车
      if (oldProduct) {
        context.commit('addCounter', oldProduct)
        resolve("当前的商品数量+1")
      }
      else {
        payload.count = 1,
          context.commit("addToCart", payload)
        resolve("添加了新的商品")

      }
    })
  }

}