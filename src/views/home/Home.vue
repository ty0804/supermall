<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template #center>
        <div>购物街</div>
      </template>
    </nav-bar>
    <swiper>
      <swiper-item v-for="(item, index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" />
        </a>
      </swiper-item>
    <swiper-item
  </div>
</template>

<script>
import NavBar from "components/common/navBar/NavBar.vue";
import { getHomeMultidata } from "network/home";
import { Swiper, SwiperItem } from "components/common/swiper";
import SwiperItem from '../../components/common/swiper/SwiperItem.vue';

export default {
  name: "Home",
  components: {
    NavBar,
    Swiper,
    SwiperItem
    SwiperItem,
  },
  data() {
    return {
      banners: [],
      recommends: [],
    };
  },
  // 在首页组件创建完成后发送网络请求
  created() {
    // 1.请求多个数据
    getHomeMultidata().then((res) => {
      console.log(res);
      //created的this是组件对象，箭头函数向上查找this
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    });
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
}
</style>