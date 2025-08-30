<template>
  <view class="frame3">
    <view class="frame1" :class="{ active: currentPage === 'painting' }" @tap="navigateToAI">
      <image src="/static/mey13hjj-7bnxieb.svg" class="brush-line1" />
      <text class="text4" :class="{ active: currentPage === 'painting' }">AI绘图</text>
    </view>
    <view class="frame2" :class="{ active: currentPage === 'space' }" @tap="navigateToSpace">
      <image src="/static/mey13hjj-5nroqr6.svg" class="user-line1" />
      <text class="text5" :class="{ active: currentPage === 'space' }">我的空间</text>
    </view>
  </view>
</template>

<script setup>
// 定义props
const props = defineProps({
  currentPage: {
    type: String,
    default: 'painting',
    validator: (value) => ['painting', 'space'].includes(value)
  }
})

// 导航功能
const navigateToAI = () => {
  if (props.currentPage !== 'painting') {
    uni.navigateTo({
      url: '/pages/painting/painting'
    }).catch(err => {
      console.error('导航失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    })
  }
}

const navigateToSpace = () => {
  if (props.currentPage !== 'space') {
    uni.navigateTo({
      url: '/pages/space/space'
    }).catch(err => {
      console.error('导航失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    })
  }
}
</script>

<style scoped>
.frame3 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 100px;
  background: rgba(255, 255, 255, 0.5);
  padding: 5px 2vw;
  width: 100%;
  height: 67px !important;
  min-height: 67px !important;
  max-height: 67px !important;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  box-sizing: border-box;
}

.frame1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  height: 49px !important;
  min-height: 49px !important;
  max-height: 49px !important;
  box-sizing: border-box;
  gap: 2px;
  min-width: 80px;
  cursor: pointer;
}

.frame1.active {
  background: rgba(255, 130, 12, 0.2);
}

.brush-line1 {
  width: 30px;
  height: 28px;
  filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%);
}

.frame1.active .brush-line1 {
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(25deg) brightness(118%) contrast(119%);
}

.text4 {
  text-align: center;
  line-height: 18px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 12px;
}

.text4.active {
  color: #ff820c;
}

.frame2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  height: 49px !important;
  min-height: 49px !important;
  max-height: 49px !important;
  box-sizing: border-box;
  gap: 1px;
  min-width: 80px;
  cursor: pointer;
}

.frame2.active {
  background: rgba(255, 130, 12, 0.2);
}

.user-line1 {
  width: 30px;
  height: 28px;
  filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%);
}

.frame2.active .user-line1 {
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(25deg) brightness(118%) contrast(119%);
}

.text5 {
  text-align: center;
  line-height: 18px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 12px;
}

.text5.active {
  color: #ff820c;
}
</style>