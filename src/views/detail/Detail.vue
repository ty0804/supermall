<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" ref="swiper"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        :param-info="paramInfo"
        ref="params"
      ></detail-param-info>
      <detail-comment-info
        :comment-info="commentInfo"
        ref="comment"
      ></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-button-bar @addToCart="addToCart"></detail-button-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailButtonBar from "@/views/detail/childComps/DetailButtonBar";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/content/backTop/BackTop";

import { debounce } from "common/utils";

import { mapActions } from "vuex";

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail";

import { itemListenerMixin } from "common/mixin";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailButtonBar,
    Scroll,
    GoodsList,
    BackTop,
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [], // 轮播图
      goods: {}, // 商品基本信息
      shop: {}, // 店铺
      detailInfo: {}, //商品详情
      paramInfo: {}, // 参数
      commentInfo: {}, // 评论
      recommends: [], // 推荐
      themeTopYs: [], // 标题内容对应的y值
      getThemeTopY: null, // 防抖
      currentIndex: 0, // 当前滚动到第几个主题
      isShowBackTop: false,
    };
  },
  created() {
    // 保存传入的iid
    this.iid = this.$route.params.iid;
    // 根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      const data = res.result;
      // 1.获取顶部轮播图片
      this.topImages = data.itemInfo.topImages;
      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      // 3.获取店铺信息
      this.shop = new Shop(data.shopInfo);
      // 4.获取商品详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      // 6.获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });
    // 请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });

    // 获取四个主题的offsetTop
    // this.getThemeTopY = debounce(() => {
    //   this.themeTopYs = [];
    //   // offsetTop是相对于上级scroll顶部的距离
    //   this.themeTopYs.push(this.$refs.swiper.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    //   // console.log(this.themeTopYs);
    // }, 100);

    this.getThemeTopY = () => {
      this.themeTopYs = [];
      // offsetTop是相对于上级scroll顶部的距离
      this.themeTopYs.push(this.$refs.swiper.$el.offsetTop);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE); // js里面number的最大值
      // console.log(this.themeTopYs);
    };
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
  destroyed() {
    // 取消全局事件的监听;
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },

  methods: {
    ...mapActions(["addCart"]),
    // detailGoodsInfo中发射的函数，监听商品详情图片已经加载完成
    imageLoad() {
      // console.log("aaa");
      this.$refs.scroll.refresh();
      // 获取顶部四个主题对应的offsetTop
      this.getThemeTopY();
    },
    titleClick(index) {
      // console.log(index);
      // console.log(this.themeTopYs[index]);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500);
    },
    // 监听滚动到哪个主题
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y;
      //2.positionY和主题中值进行对比
      // [0，7938，9120，9452]
      // positionY 在 0 和 7938 之间，index=0
      // positionY 在 7938 和 9120 之间，index=1
      // positionY 在 9120 和 9452 之间，index=2

      // positionY 大于等于 9452值，index=3
      let length = this.themeTopYs.length;
      // **法一 普通做法
      /*   for (let i = 0; i < length; i++) {
        // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1])(
        // console.log(i);
        //}
        // 判断this.currentIndex != i 避免频繁打印

        if (
          this.currentIndex != i &&
          ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopYs[i]))
        ) {
          // console.log(i);
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        } 
      } */
      // **法二 hack做法，引入一个最大值与最后一个值进行比较
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex != i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // 3.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
    },
    backClick() {
      // 第三个参数是过渡时间
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    addToCart() {
      // console.log(this.goods);
      // console.log("--点击了加入购物车--");
      // 获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // console.log(product);

      // 将商品添加到购物车里面
      // this.$store.dispatch("addCart", product).then((res) => {
      //   console.log(res);
      // });
      // 用了mapActions之后可以如下调用addcart
      this.addCart(product).then((res) => {
        //  加入购物车成功，进行toast提示
        this.$toast.show(res);
      });
    },
  },
};
</script>

<style scoped>
/* 不让底部的tabbar显示  方法一 */
/* 方法二  <main-tab-bar v-show="$route.path.indexOf('detail') == -1" /> */

/* #detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
} */

#detail {
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 58px);
}
</style>