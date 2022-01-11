<template>
  <div class="tab-bar-item" @click="itemClick">
    <!-- <div :class="{ active: isActive }"> -->
    <div :style="activeStyle">
      <!-- <div :style="{ color: activeColor }"> -->
      <slot name="item-icon"></slot>
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "pink",
    },
  },
  data() {
    return {
      // isActive: true,
    };
  },
  computed: {
    isActive() {
      return this.$route.path === this.path;
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
  methods: {
    itemClick() {
      this.$router.replace(this.path);
    },
  },
};
</script>

<style scoped>
.tab-bar-item {
  /* flex-grow属性都为1，则它们将等分剩余空间（如果有的话） */
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 10px;
}
.tab-bar-item span {
  display: inline-block;
  font-size: 22px;
  padding-top: 6px;
}
</style>