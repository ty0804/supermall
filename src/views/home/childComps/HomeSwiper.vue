<template>
  <div>
    <swiper>
      <swiper-item v-for="(item, index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="imageLoad" />
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "Homeswiper",
  components: {
    Swiper,
    SwiperItem,
  },
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isLoad: false, //标记是否emit过
    };
  },
  methods: {
    imageLoad() {
      // console.log("轮播图图片加载");
      // 只需要发送一次事件,加载出一个图片就有高度了
      if (!this.isLoad) {
        this.$emit("swiperImageLoad");
        this.isLoad = true;
      }
    },
  },
};
</script>

<style scoped>
</style>