<template>
  <div class="goods-item" @click="itemClick">
    <!-- <img :src="showImage" alt="" @load="imageLoad" /> -->
    <!-- 图片懒加载 -->
    <img v-lazy="showImage" alt="" @load="imageLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Goodslistitem",

  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    imageLoad() {
      // GoodsListItem->Home 非父子组件通信，使用事件总线$bus
      // console.log(this.$bus); // 本身没有这个东西，要去Vue原型里面加
      // 每一张图片加载完成就发射一次事件.
      this.$bus.$emit("itemImageLoad");
    },
    itemClick() {
      this.$router.push("/detail/" + this.goodsItem.iid);
    },
  },
  computed: {
    showImage() {
      return (
        this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
      );
    },
  },
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}
.goods-item img {
  width: 100%;
  border-radius: 5px;
}
.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}
.goods-info {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}
.goods-info .price {
  color: var(--color-high-text);
  margin-right: 25px;
}
.goods-info .collect {
  position: relative;
}
.goods-info .collect::before {
  content: "\e907";
  font-family: "icomoon";
  position: absolute;
  left: -15px;
  width: 14px;
  height: 14px;
  font-size: 8px;
}
</style>