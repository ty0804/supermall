import {
  debounce
} from './utils'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null, // 全局事件监听的保存

    }
  },
  mounted() {
    // 监听goods-list-item中的图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    // 对监听的事件进行保存
    this.itemImgListener = () => {
      refresh();
    };
    // 每一张图片加载完成就会触发一次itemImageLoad事件，使用防抖函数进行刷新，不然会刷新很多次
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    // console.log('我是混入的内容');
  },
}
