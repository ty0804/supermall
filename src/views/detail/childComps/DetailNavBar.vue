<template>
  <nav-bar>
    <div slot="left" @click="backClick">
      <span class="icon-chevron-left"></span>
    </div>
    <div slot="center" class="title">
      <div
        v-for="(item, index) in titles"
        :key="index"
        class="title-item"
        :class="{ active: index == currentIndex }"
        @click="itemClick(index)"
      >
        {{ item }}
      </div>
    </div>
  </nav-bar>
</template>

<script>
import NavBar from "@/components/common/navBar/NavBar";

export default {
  name: "Detailnavbar",
  components: {
    NavBar,
  },
  data() {
    return {
      titles: ["商品", "参数", "评论", "推荐"],
      currentIndex: 0,
    };
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit("titleClick", index);
    },
    backClick() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.title {
  display: flex;
  font-size: 17px;
  padding: 0 20px 0 20px;
}
.title-item {
  flex: 1;
}
.active {
  color: var(--color-high-text);
}

.icon-chevron-left:before {
  font-size: 25px;
  display: block;
  padding-top: 10px;
}
</style>