<template>
  <div class="goods">
    <goods-list-item
      v-for="(item, index) in goods"
      :key="index"
      :goods-item="item"
    ></goods-list-item>
  </div>
</template>

<script>
import GoodsListItem from "@/components/content/goods/GoodsListItem";

export default {
  name: "Goodslist",
  components: {
    GoodsListItem,
  },
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.goods {
  display: flex;
  /* 不在一行显示 */
  flex-wrap: wrap;
  /* 均等分 */
  justify-content: space-evenly;
}
</style>