<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template #center>
        <div>购物街</div>
      </template>
    </nav-bar>
    <tab-control
      class="tab-control"
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabcontrol1"
      v-show="isTabFixed"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabcontrol2"
      ></tab-control>
      <goods-list :goods="showGoods"> </goods-list>
    </scroll>

    <!-- 组件不能直接@click 需要加.navtive修饰符 修饰组件根元素的原生事件  -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navBar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";

import { itemListenerMixin } from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false, //是否吸顶
      saveY: 0, //记录离开的位置
    };
  },
  // 在首页组件创建完成后发送网络请求
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();
    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },

  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  mounted() {
    /**  home和detail中使用mixin处理以下代码
     * / const newRefresh = debounce(this.$refs.scroll.refresh, 100);
    // // 监听item中图片加载完成
    // this.itemImgListener = () => {
    //   newRefresh();
    // };
    // this.$bus.$on("itemImageLoad", this.itemImgListener);
     */
  },
  // activated，deactivated这两个函数在有keep-livede时候才能用
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    // 最好刷新一下，以防出现不能滚动的bug
    this.$refs.scroll.refresh();
  },
  deactivated() {
    // 保存离开home时的位置
    this.saveY = this.$refs.scroll.getScrollY();
    // console.log(this.saveY);

    // 2.取消全局事件的监听，这里的第二个参数(on对应的第二个参数)必须要传，不然这个全局事件全部取消
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    /**
     * 事件监听相关方法
     */

    tabClick(index) {
      this.currentType = ["pop", "new", "sell"][index];
      this.$refs.tabcontrol1.currentIndex = index;
      this.$refs.tabcontrol2.currentIndex = index;
    },

    backClick() {
      // 第三个参数是过渡时间
      this.$refs.scroll.scrollTo(0, 0, 500);
    },

    contentScroll(position) {
      // 显示BackTop
      // console.log("----监听到了home页面滚动事件");
      this.isShowBackTop = -position.y > 1000;
      // 决定tabControl是否吸顶
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },

    loadMore() {
      this.getHomeGoods(this.currentType);
    },

    swiperImageLoad() {
      // console.log("-----");
      // 获取tabcontrol的offsetTop
      // 所有的组件都有一个属性$el,用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabcontrol2.$el.offsetTop;
      // console.log(this.tabOffsetTop);
    },

    /**
     *  网络请求相关方法
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        //created的this是组件对象，箭头函数向上查找this
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },

    // 按类型请求商品数据
    getHomeGoods(type) {
      // 要请求的page为当前page+1
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  /* vh：相对于视口的高度。视口被均分为100单位的vh */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
.tab-control {
  position: relative;
  z-index: 9;
}
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */

/* .fixed {
  position: fixed;
  left: 0;
  top: 44px;
} */
.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  overflow: hidden;
}
</style>