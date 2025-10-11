<template>
  <view class="frame4">
    <view class="frame5"></view>
    <view class="frame6">
      <view class="left-section">
        <view v-if="showVipIcon" class="vip-btn">
          <image src="/static/vip.svg" class="vip-icon" />
        </view>
      </view>
      <text class="text">{{ title }}</text>
      <view class="header-buttons">
        <view v-if="showClear" class="clear-btn" @click="handleClearClick">
          <image src="/static/delete-icon.svg" class="clear-icon" />
        </view>
        <view v-if="showSettings" class="settings-btn" @click="handleSettingsClick">
          <image src="/static/settings-gear.svg" class="settings-icon" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, defineEmits, ref, onMounted } from 'vue'
import { user } from '@/utils/user.js'

// 定义props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showSettings: {
    type: Boolean,
    default: false
  },
  showClear: {
    type: Boolean,
    default: false
  }
})

// 定义emits
const emit = defineEmits(['clear'])

// 响应式用户信息
const vipRank = ref(null)

// 计算是否显示VIP图标
const showVipIcon = computed(() => {
  return vipRank.value
})

// 组件挂载时获取用户信息
onMounted(async () => {
  try {
    vipRank.value = await user.isVip()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

// 设置按钮点击事件
const handleSettingsClick = () => {
  uni.navigateTo({
    url: '/pages/setting/setting'
  })
}

// 清除按钮点击事件
const handleClearClick = () => {
  emit('clear')
}
</script>

<style scoped>
.frame4 {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f4f0eb;
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

.header-buttons {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 15px;
  gap: 8px;
}

.clear-btn,
.settings-btn {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover,
.settings-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.clear-icon,
.settings-icon {
  width: 20px;
  height: 20px;
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
  position: relative;
}

.left-section {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.vip-btn {
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vip-icon {
  width: 34px;
  height: 34px;
  display: block;
}

.settings-icon {
  width: 24px;
  height: 24px;
  display: block;
}
</style>