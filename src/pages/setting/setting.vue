<template>
  <view class="setting">
    <!-- 顶部返回按钮 -->
    <BackButton />
    
    <!-- 订阅会员选项 -->
    <view class="frame555">
      <view class="frame552" @click="goToSubscription">
        <view class="frame577">
          <text class="text">订阅会员</text>
          <image src="/static/crown.svg" class="crown-icon" />
        </view>
        <image src="/static/arrow-right.svg" class="arrow-right-s-line1" />
      </view>
    </view>
    
    <!-- 用户协议选项 -->
    <view class="frame556">
      <view class="frame553" @click="goToUserAgreement">
        <text class="text2">用户协议</text>
        <image src="/static/arrow-right.svg" class="arrow-right-s-line1" />
      </view>
    </view>
    
    <!-- 隐私政策选项 -->
    <view class="frame556">
      <view class="frame553" @click="goToPrivacyPolicy">
        <text class="text2">隐私政策</text>
        <image src="/static/arrow-right.svg" class="arrow-right-s-line1" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import BackButton from '@/components/BackButton.vue'

// 跳转到订阅会员页面
const goToSubscription = () => {
  uni.navigateTo({
    url: '/pages/subscribe/subscribe',
    animationType: 'slide-in-right',
  })
}

// 跳转到用户协议页面
const goToUserAgreement = () => {
  // TODO: 实现跳转到用户协议页面
  console.log('跳转到用户协议页面')
}

// 跳转到隐私政策页面
const goToPrivacyPolicy = () => {
  // TODO: 实现跳转到隐私政策页面
  console.log('跳转到隐私政策页面')
}
</script>

<style scoped>
.setting {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #f4f0eb;
  min-height: 100vh;
  width: 100%;
  padding-bottom: 558px;
  overflow: hidden;
}

.frame555 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: center;
  width: 80%;
  max-width: 400px;
  margin-top: 2px;
  padding: 20px 10px 10px;
  row-gap: 10px;
}

.frame552 {
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  align-self: stretch;
  justify-content: space-between;
  border-radius: 999px;
  background: rgba(255, 130, 12, 0.2);
  padding: 10px 25px 11px 0px;
}

.frame577 {
  display: flex;
  align-items: center;
  column-gap: 3px;
  margin-top: 1px;
  padding-right: 30px;
  padding-left: 30px;
  width: 159px;
}

.text {
  flex-shrink: 0;
  line-height: 22px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.crown-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  overflow: hidden;
}

.frame556 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: center;
  width: 80%;
  max-width: 400px;
  padding: 10px;
  row-gap: 10px;
}

.frame553 {
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  align-self: stretch;
  justify-content: space-between;
  border-radius: 999px;
  background: rgba(255, 130, 12, 0.2);
  padding: 10px 25px 12px 31px;
}

.text2 {
  margin: 2px 0px 0px;
  line-height: 22px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.arrow-right-s-line1 {
  width: 24px;
  height: 24px;
  overflow: hidden;
}
</style>