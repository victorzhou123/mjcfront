<template>
  <view class="frame4">
    <text class="text">{{ title }}</text>
  </view>
</template>

<script setup>
// 定义props
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.frame4 {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  width: 100%;
  height: 44px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.text {
  line-height: 20px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 12px;
  white-space: nowrap;
}
</style>