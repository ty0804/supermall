<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item
        v-for="(item, index) in cartList"
        :key="index"
        :item-info="item"
      ></cart-list-item>
    </scroll>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Scroll from "components/common/scroll/Scroll";
import CartListItem from "@/views/cart/childComps/CartListItem";

export default {
  name: "Cartlist",
  components: {
    Scroll,
    CartListItem,
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {},
  computed: {
    ...mapGetters(["cartList"]),
  },
  activated() {
    this.$refs.scroll.refresh();
  },
};
</script>

<style scoped>
.cart-list {
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 49px - 40px);
  overflow: hidden;
}
</style>