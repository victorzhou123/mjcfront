<template>
  <view class="painting">
    <!-- 顶部标题栏 -->
    <TopHeader title="AI绘画" />
    
    <!-- 主要内容区域 -->
    <view class="auto-wrapper">
      <scroll-view ref="scrollViewRef" class="frame554" scroll-y="true" :scroll-top="scrollTop" :scroll-into-view="scrollIntoView">
        <!-- 统一渲染所有消息，按时间戳排序 -->
        <template v-for="(message, index) in allMessages" :key="message.type + '-' + index">
          <!-- 用户消息 -->
          <view v-if="message.type === 'user'" class="frame11" :id="'message-' + index">
            <view class="frame10">
              <text class="timestamp">{{ message.timestamp }}</text>
              <view class="rectangle2">
                <text class="text2">{{ message.content }}</text>
              </view>
            </view>
            <view class="frame9">
              <image src="/static/user_avatar.png" class="ellipse1" mode="aspectFill" />
            </view>
          </view>
          
          <!-- AI回复消息 -->
          <view v-else-if="message.type === 'ai'" class="frame92" :id="'message-' + index">
            <view class="frame7">
              <image src="/static/mj_avatar.png" class="ellipse1" mode="aspectFill" />
            </view>
            <view class="frame8">
              <text class="ai-timestamp">{{ message.timestamp }}</text>
              <view class="rectangle1">
                <!-- 单张图片显示 -->
                <image v-if="message.imageUrl" :src="message.imageUrl" class="ai-image" mode="aspectFit" @error="handleImageError" @load="handleImageLoad" />
                <!-- 4张图片网格显示 -->
                <view v-else-if="message.images && message.images.length === 4" class="images-grid">
                  <view class="grid-row">
                    <image :src="message.images[0]" class="grid-image" mode="aspectFit" @error="handleImageError" @load="handleImageLoad" />
                    <image :src="message.images[1]" class="grid-image" mode="aspectFit" @error="handleImageError" @load="handleImageLoad" />
                  </view>
                  <view class="grid-row">
                    <image :src="message.images[2]" class="grid-image" mode="aspectFit" @error="handleImageError" @load="handleImageLoad" />
                    <image :src="message.images[3]" class="grid-image" mode="aspectFit" @error="handleImageError" @load="handleImageLoad" />
                  </view>
                </view>
                <!-- 加载中状态 -->
                <view v-else class="loading-container">
                  <text class="loading-text">正在生成图片...</text>
                </view>
              </view>
            </view>
          </view>
        </template>
        <!-- 底部锚点元素 -->
        <view id="bottom-anchor" style="height: 1px;"></view>
      </scroll-view>     
    </view>
    
    <!-- 底部输入区域 -->
    <InputArea 
      class="input-area"
      ref="inputAreaRef"
      :is-generating="isGenerating" 
      @generate="handleGenerate"
    />
    
    <!-- 底部导航栏 -->
    <BottomNavigation current-page="painting" />
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import TopHeader from '@/components/TopHeader.vue'
import InputArea from '@/components/InputArea.vue'
import { painter } from '@/utils/painter.js'

// 响应式数据
const isGenerating = ref(false)
const userMessages = ref([])
const aiReplies = ref([])
const scrollViewRef = ref(null)
const scrollTop = ref(0)
const scrollIntoView = ref('')
const inputAreaRef = ref(null)

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
const handleGenerate = async (inputText) => {
  if (!inputText.trim() || isGenerating.value) {
    return
  }
  
  const userMessage = {
    content: inputText,
    timestamp: formatTimestamp()
  }
  
  // 添加用户消息
  userMessages.value.push(userMessage)
  
  // 等待DOM更新后滚动
  await nextTick()
  await scrollToBottom()
  
  // 创建AI回复占位，时间戳比用户消息晚1秒
  const aiReply = {
    timestamp: formatTimestamp(1),
    imageUrl: null,
    images: null
  }
  aiReplies.value.push(aiReply)
  
  // 再次滚动到底部显示AI占位消息
  await nextTick()
  await scrollToBottom()
  
  // 保存输入文本用于API调用
  const prompt = inputText
  isGenerating.value = true
  
  try {
    // 调用真实的API
    const taskId = await painter.paint(prompt)
    console.log('任务ID:', taskId)
    
    // 轮询任务状态直到完成
    let result
    while (true) {
      result = await painter.pollTaskStatus(taskId)
      console.log('任务状态:', result.status)
      
      if (result.status === 2) {
        // 任务完成
        break
      }
      
      // 等待1秒后继续请求
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // 更新AI回复的图片URL
    const lastReply = aiReplies.value[aiReplies.value.length - 1]
    if (result.images && result.images.length > 0) {
      if (result.images.length === 4) {
        // 如果有4张图片，按顺序拼接显示
        lastReply.images = result.images
        lastReply.imageUrl = null // 清空单张图片URL
        console.log('生成的4张图片URLs:', result.images)
        console.log('aiReplies:', aiReplies)
      } else {
        // 如果不是4张图片，使用第一张
        lastReply.imageUrl = result.images[0]
        lastReply.images = null // 清空多张图片数组
        console.log('生成的图片URL:', lastReply.imageUrl)
      }
    } else {
      throw new Error('未获取到生成的图片')
    }
    
    // 图片加载完成后滚动到底部
    await nextTick()
    setTimeout(async () => {
      await scrollToBottom()
    }, 200) // 等待图片渲染
    
    // AI回复完成后聚焦输入框
    await nextTick()
    if (inputAreaRef.value && inputAreaRef.value.focusInput) {
      inputAreaRef.value.focusInput()
    }
    
  } catch (error) {
    console.error('生成图片失败:', error)
    
    // 移除失败的AI回复
    aiReplies.value.pop()
    
    uni.showToast({
      title: error.message || '生成失败，请重试',
      icon: 'none'
    })
  } finally {
    isGenerating.value = false
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  console.log('scrollToBottom called')
  await nextTick()
  
  // 使用scroll-into-view直接滚动到底部锚点
  scrollIntoView.value = 'bottom-anchor'
  
  // 清除scroll-into-view值，避免影响后续滚动
  setTimeout(() => {
    scrollIntoView.value = ''
  }, 300)
}

// 监听消息变化，自动滚动到底部
watch([userMessages, aiReplies], async () => {
  console.log('Messages changed, userMessages:', userMessages.value.length, 'aiReplies:', aiReplies.value.length)
  // 等待DOM更新后再滚动
  await nextTick()
  setTimeout(() => {
    scrollToBottom()
  }, 100)
}, { deep: true, flush: 'post' })



// 合并并排序所有消息
const allMessages = computed(() => {
  const messages = []
  
  // 添加用户消息
  if (Array.isArray(userMessages.value) && userMessages.value.length > 0) {
    userMessages.value.forEach(msg => {
      if (msg && msg.content && msg.timestamp) {
        messages.push({
          type: 'user',
          content: msg.content,
          timestamp: msg.timestamp,
          timestampValue: new Date(msg.timestamp).getTime()
        })
      }
    })
  }
  
  // 添加AI回复
  if (Array.isArray(aiReplies.value) && aiReplies.value.length > 0) {
    aiReplies.value.forEach(reply => {
      if (reply && reply.timestamp) {
        messages.push({
          type: 'ai',
          imageUrl: reply.imageUrl,
          images: reply.images,
          timestamp: reply.timestamp,
          timestampValue: new Date(reply.timestamp).getTime()
        })
      }
    })
  }
  
  // 按时间戳升序排序
  return messages.sort((a, b) => a.timestampValue - b.timestampValue)
})

// 图片加载成功处理
const handleImageLoad = (e) => {
  console.log('图片加载成功:', e.target.src)
}

// 图片加载错误处理
const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
  console.error('错误详情:', e)
  
  // 可以尝试重新加载或显示默认图片
  uni.showToast({
    title: '图片加载失败',
    icon: 'none'
  })
}

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

/* absolute-height: 75% */
.auto-wrapper {
  position: absolute;
  bottom: 22%;
  height: 65%;
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

/* absolute-height: 10% */
.input-area {
  position: fixed;
  bottom: 12%;
  height: 10%;
  left: 0;
  right: 0;
  z-index: 100;
}

.ellipse1 {
  border-radius: 50%;
  width: 55px;
  height: 55px;
  object-fit: cover;
}

.frame11 {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 4vw 8px 4vw;
  width: 100%;
  min-width: 320px;
}

.frame10 {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
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
  padding: 0 0 10px 10px;
}

.frame92 {
  display: flex;
  align-items: flex-start;
  padding: 8px 4vw 8px 4vw;
  width: 100%;
  max-width: 100vw;
  min-height: auto;
  position: relative;
  z-index: 1000;
}

.frame7 {
  display: inline-flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: center;
  column-gap: 10px;
  padding: 0px 10px 10px 0px;
}

.frame8 {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: flex-start;
  margin-left: 10px;
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
  min-width: 200px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 19px;
  padding: 10px;
}

.ai-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 60px;
}

.loading-text {
  color: #666;
  font-size: 14px;
  text-align: center;
}

.images-grid {
  display: flex;
  flex-direction: column;
  width: fit-content;
  /* max-width: 300px; */
}

.grid-row {
  display: flex;
  width: fit-content;
}

.grid-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.frame93 {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px 4vw 10px 2vw;
  width: 100%;
}

</style>