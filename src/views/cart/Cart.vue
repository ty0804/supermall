<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ cartLength }})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navBar/NavBar";
import CartList from "@/views/cart/childComps/CartList";
import CartBottomBar from "@/views/cart/childComps/CartBottomBar";

import { mapActions, mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar,
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {},

  computed: {
    // cartLength可以直接在computed里面写，如果引用的地方多的话就可以写在getters里面
    // cartLength() {
    //   return this.$store.state.cartList.length;
    // },
    ...mapGetters(["cartLength"]),
  },
};
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>