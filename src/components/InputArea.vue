<template>
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
</template>

<script setup>
import { ref, defineEmits, nextTick } from 'vue'

// 定义 props
const props = defineProps({
  isGenerating: {
    type: Boolean,
    default: false
  }
})

// 定义 emits
const emit = defineEmits(['generate'])

// 响应式数据
const inputText = ref('')
const inputFocused = ref(false)
const inputRef = ref(null)

// 输入框焦点处理
const focusInput = () => {
  if (!props.isGenerating) {
    inputFocused.value = true
    // 使用nextTick确保DOM更新后再聚焦
    nextTick(() => {
      try {
        // 检查 inputRef 是否存在且有 focus 方法
        if (inputRef.value && typeof inputRef.value.focus === 'function') {
          inputRef.value.focus()
        } else {
          // 在 uni-app 环境中，可能需要使用不同的方式
          console.log('Input focus method not available, using alternative approach')
        }
      } catch (error) {
        console.warn('Failed to focus input:', error)
      }
    })
  }
}

const handleInputFocus = () => {
  inputFocused.value = true
}

const handleInputBlur = () => {
  inputFocused.value = false
}

// 处理生成按钮点击
const handleGenerate = () => {
  if (!inputText.value.trim() || props.isGenerating) {
    return
  }
  
  // 发送生成事件给父组件
  emit('generate', inputText.value)
  
  // 清空输入框
  inputText.value = ''
}

// 暴露方法给父组件
defineExpose({
  focusInput
})
</script>

<style scoped>
.frame20 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #f4f0eb;
  position: fixed;
  left: 0;
  z-index: 999;
}

.frame21 {
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: #dddddd;
  padding: 1vw 4vw;
  flex: 1;
  min-width: 0;
  min-height: 3vh;
  max-height: 20px;
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
  flex-shrink: 0;
  width: auto;
  min-width: 60px;
}

.frame18 {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: rgba(255, 130, 12, 0.4);
  padding: 8px 16px;
  min-width: 60px;
  max-width: 80px;
  min-height: 3vh;
  max-height: 20px;
  white-space: nowrap;
}

.text {
  line-height: 22px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}

/* 响应式媒体查询 */
@media screen and (max-width: 480px) {
  .frame20 {
    gap: 8px;
    padding: 8px 12px;
    height: 12vh;
    min-height: 45px;
  }
  
  .frame21 {
    padding: 8px 16px;
    min-width: 0;
  }
  
  .frame18 {
    padding: 6px 12px;
    min-width: 50px;
    font-size: 12px;
  }
  
  .text3 {
    font-size: 13px;
  }
}

@media screen and (min-width: 768px) {
  .frame20 {
    gap: 12px;
    padding: 8px 16px;
    height: 50px;
    max-height: 50px;
  }
  
  .frame21 {
    padding: 6px 20px;
    min-width: 0;
  }
  
  .frame18 {
    padding: 8px 16px;
    min-width: 80px;
    height: 35px;
  }
}

@media screen and (min-width: 1024px) {
  .frame20 {
    max-width: 800px;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>