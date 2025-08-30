<template>
  <view class="profile">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="title">我的空间</text>
    </view>
    
    <!-- 用户信息区域 -->
    <view class="user-info">
      <view class="avatar">
        <view class="avatar-placeholder" />
      </view>
      <text class="username">用户昵称</text>
      <text class="user-id">ID: 123456</text>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-list">
      <view class="menu-item" @tap="navigateToHistory">
        <text class="menu-text">生成历史</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @tap="navigateToSettings">
        <text class="menu-text">设置</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @tap="navigateToAbout">
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
    </view>
    
    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <view class="nav-item" @tap="navigateToAI">
        <image src="/static/mey13hjj-7bnxieb.svg" class="nav-icon" />
        <text class="nav-text">AI绘图</text>
      </view>
      <view class="nav-item active">
        <image src="/static/mey13hjj-5nroqr6.svg" class="nav-icon" />
        <text class="nav-text-active">我的空间</text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 导航功能
const navigateToAI = () => {
  uni.navigateTo({
    url: '/pages/painting/painting'
  })
}

const navigateToHistory = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const navigateToSettings = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const navigateToAbout = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}
</script>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  background: #f4f0eb;
  width: 100vw;
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  width: 100%;
  height: 44px;
}

.title {
  line-height: 22px;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: #ffffff;
  margin: 20px;
  border-radius: 12px;
}

.avatar {
  margin-bottom: 16px;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #d9d9d9;
}

.username {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
}

.user-id {
  font-size: 14px;
  color: #666666;
}

.menu-list {
  background: #ffffff;
  margin: 0 20px;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-text {
  font-size: 16px;
  color: #000000;
}

.menu-arrow {
  font-size: 16px;
  color: #cccccc;
}

.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.5);
  padding: 5px 32px;
  width: 100%;
  height: 67px;
  margin-top: auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  height: 49px;
  gap: 1px;
}

.nav-item.active {
  border-radius: 999px;
  background: rgba(255, 130, 12, 0.2);
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-text {
  text-align: center;
  line-height: 22px;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.nav-text-active {
  text-align: center;
  line-height: 22px;
  color: #ff820c;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}
</style>