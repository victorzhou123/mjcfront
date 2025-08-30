<template>
  <view class="painting">
    <!-- 顶部标题栏 -->
    <view class="frame4">
      <text class="text">AI绘画</text>
    </view>
    
    <!-- 主要内容区域 -->
    <view class="auto-wrapper">
      <scroll-view class="frame554" scroll-y="true">
        <!-- 统一渲染所有消息，按时间戳排序 -->
        <template v-for="(message, index) in allMessages" :key="message.type + '-' + index">
          <!-- 用户消息 -->
          <view v-if="message.type === 'user'" class="frame11">
            <view class="frame10">
              <text class="timestamp">{{ message.timestamp }}</text>
              <view class="rectangle2">
                <text class="text2">{{ message.content }}</text>
              </view>
            </view>
            <view class="frame9">
              <view class="ellipse1" />
            </view>
          </view>
          
          <!-- AI回复消息 -->
          <view v-else-if="message.type === 'ai'" class="frame92">
            <view class="frame7">
              <image src="/static/mj_avatar.png" class="ellipse1" mode="aspectFill" />
            </view>
            <view class="frame8">
              <text class="ai-timestamp">{{ message.timestamp }}</text>
              <view class="rectangle1">
                <image v-if="message.imageUrl" :src="message.imageUrl" class="ai-image" mode="aspectFit" />
                <text v-else class="loading-text">正在生成图片...</text>
              </view>
            </view>
          </view>
        </template>

      </scroll-view>
      
      <!-- 底部输入区域 -->
      <view class="frame20">
        <view class="frame21" @tap="focusInput">
          <input 
            ref="inputRef"
            class="text3" 
            v-model="inputText" 
            placeholder="在此输入提示词"
            :disabled="isGenerating"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @tap.stop="focusInput"
            :focus="inputFocused"
          />
        </view>
        <view class="frame19">
          <view class="frame18" @tap="handleGenerate">
            <text class="text">{{ isGenerating ? '生成中...' : '绘制' }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部导航栏 -->
    <view class="frame3">
      <view class="frame1" @tap="navigateToAI">
        <image src="/static/mey13hjj-7bnxieb.svg" class="brush-line1" />
        <text class="text4">AI绘图</text>
      </view>
      <view class="frame2" @tap="navigateToProfile">
        <image src="/static/mey13hjj-5nroqr6.svg" class="user-line1" />
        <text class="text5">我的空间</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'

// 响应式数据
const inputText = ref('')
const isGenerating = ref(false)
const userMessages = ref([])
const aiReplies = ref([])
const inputFocused = ref(false)
const inputRef = ref(null)

// 格式化时间戳
const formatTimestamp = (addSeconds = 0) => {
  const now = new Date()
  now.setSeconds(now.getSeconds() + addSeconds)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 处理生成按钮点击
const handleGenerate = async () => {
  if (!inputText.value.trim() || isGenerating.value) {
    return
  }
  
  const userMessage = {
    content: inputText.value,
    timestamp: formatTimestamp()
  }
  
  // 添加用户消息
  userMessages.value.push(userMessage)
  
  // 创建AI回复占位，时间戳比用户消息晚1秒
  const aiReply = {
    timestamp: formatTimestamp(1),
    imageUrl: null
  }
  aiReplies.value.push(aiReply)
  
  // 清空输入框
  const prompt = inputText.value
  inputText.value = ''
  isGenerating.value = true
  
  try {
    // 模拟调用后端API
    // 这里应该替换为实际的API调用
    await simulateAPICall(prompt)
    
    // 模拟返回图片URL
    const lastReply = aiReplies.value[aiReplies.value.length - 1]
    // 使用静态资源路径
    lastReply.imageUrl = '/static/WechatIMG100.jpeg' // 临时使用用户指定的图片
    
  } catch (error) {
    console.error('生成图片失败:', error)
    uni.showToast({
      title: '生成失败，请重试',
      icon: 'none'
    })
  } finally {
    isGenerating.value = false
  }
}

// 模拟API调用
const simulateAPICall = (prompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 3000) // 模拟3秒生成时间
  })
}

// 输入框焦点处理
const focusInput = () => {
  if (!isGenerating.value) {
    inputFocused.value = true
  }
}

const handleInputFocus = () => {
  inputFocused.value = true
}

const handleInputBlur = () => {
  inputFocused.value = false
}

// 导航功能
const navigateToAI = () => {
  // 当前页面，不需要跳转
}

const navigateToProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/profile'
  })
}

// 合并并排序所有消息
const allMessages = computed(() => {
  const messages = []
  
  // 添加用户消息
  userMessages.value.forEach(msg => {
    messages.push({
      type: 'user',
      content: msg.content,
      timestamp: msg.timestamp,
      timestampValue: new Date(msg.timestamp).getTime()
    })
  })
  
  // 添加AI回复
  aiReplies.value.forEach(reply => {
    messages.push({
      type: 'ai',
      imageUrl: reply.imageUrl,
      timestamp: reply.timestamp,
      timestampValue: new Date(reply.timestamp).getTime()
    })
  })
  
  // 按时间戳升序排序
  return messages.sort((a, b) => a.timestampValue - b.timestampValue)
})

// 页面加载时的初始化
onMounted(() => {
  // 页面初始状态为空，等待用户输入
})
</script>

<style scoped>
/* 基础样式重置 */
* {
  box-sizing: border-box;
}

.painting {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f4f0eb;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.text {
  line-height: 20px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 12px;
  white-space: nowrap;
}

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

.auto-wrapper {
  position: absolute;
  top: 44px;
  bottom: 121px;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.frame554 {
  flex: 1;
  width: 100%;
  padding: 0 8px;
  height: 100%;
  overflow-y: auto;
}

.ellipse1 {
  border-radius: 50%;
  background: #d9d9d9;
  width: 55px;
  height: 55px;
}

.frame11 {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 8px 21px 27px;
  width: 100%;
  min-width: 375px;
}

.frame10 {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  margin-right: 10px;
}

.timestamp {
  margin: 0px;
  padding: 0px 10px 10px 0px;
  line-height: 22px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
  text-align: right;
}

.rectangle2 {
  position: relative;
  border-radius: 19px;
  background: #d9d9d9;
  width: fit-content;
  max-width: calc(100vw - 120px);
  min-height: 40px;
  padding: 10px;
}

.text2 {
  line-height: 22px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
  word-wrap: break-word;
  word-break: break-all;
}

.frame9 {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 10px 10px;
}

.frame92 {
  display: flex;
  align-items: flex-start;
  padding-right: 16px;
  padding-left: 8px;
  width: 375px;
  height: 364px;
}

.frame7 {
  display: inline-flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: center;
  column-gap: 10px;
  padding: 0px 10px 10px;
}

.frame8 {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: flex-start;
}

.ai-timestamp {
  flex-shrink: 0;
  padding: 0px 10px 10px 0px;
  line-height: 22px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.rectangle1 {
  flex-shrink: 0;
  background: #d9d9d9;
  width: fit-content;
  max-width: calc(100vw - 120px);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 19px;
  padding: 10px;
}

.ai-image {
  max-width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.frame93 {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px 18px 10px 10px;
  width: 100%;
}

.frame20 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 10px;
  width: 100%;
  height: 54px;
  background: #f4f0eb;
  position: fixed;
  bottom: 67px;
  left: 0;
  z-index: 999;
}

.frame21 {
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: #dddddd;
  padding: 6px 26px;
  flex: 1;
  max-width: 299px;
}

.text3 {
  flex: 1;
  line-height: 22px;
  letter-spacing: 0;
  color: rgba(0, 0, 0, 0.3);
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
  border: none;
  background: transparent;
  outline: none;
  min-height: 22px;
  width: 100%;
}

.text3:focus {
  color: #000000;
}

.frame21:active {
  background: #cccccc;
}

.frame19 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 51px;
}

.frame18 {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: rgba(255, 130, 12, 0.4);
  padding: 8px 12px;
  min-width: 60px;
  height: 33px;
  white-space: nowrap;
}

.frame3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.5);
  padding: 5px 32px;
  width: 100%;
  height: 67px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
}

.frame1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 130, 12, 0.2);
  padding: 5px;
  height: 49px;
  gap: 1px;
}

.brush-line1 {
  width: 24px;
  height: 23px;
}

.text4 {
  text-align: center;
  line-height: 22px;
  letter-spacing: 0;
  color: #ff820c;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.frame2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  height: 49px;
  gap: 1px;
}

.user-line1 {
  width: 24px;
  height: 24px;
}

.text5 {
  text-align: center;
  line-height: 22px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}
</style>