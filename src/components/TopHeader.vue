<template>
  <view class="frame4">
    <view class="frame5"></view>
    <view class="frame6">
      <text class="text">{{ title }}</text>
      <view v-if="showSettings" class="settings-btn" @click="handleSettingsClick">
        <image src="/static/settings-gear.svg" class="settings-icon" />
      </view>
    </view>
  </view>
</template>

<script setup>
// 定义props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showSettings: {
    type: Boolean,
    default: false
  }
})

// 设置按钮点击事件
const handleSettingsClick = () => {
  uni.navigateTo({
    url: '/pages/setting/setting'
  })
}
</script>

<style scoped>
.frame4 {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  /* padding: 10px 15px; */
  width: 100%;
  height: 13%;
  position: fixed;
  top: 0;
  left: 0;
  /* padding-top: env(safe-area-inset-top); */
  z-index: 1000;
}

.text {
  /* line-height: 22px; */
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
  white-space: nowrap;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.settings-btn {
  margin-left: auto;
  margin-right: 15px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.frame5 {
  height: env(safe-area-inset-top);
  width: 100%;
}

.frame6 {
  height: calc(100% - env(safe-area-inset-top));
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.settings-icon {
  width: 24px;
  height: 24px;
  display: block;
}
</style>