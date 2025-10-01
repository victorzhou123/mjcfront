<template>
  <view class="frame20">
    <view class="frame21" @tap="focusInput">
      <textarea
        ref="inputRef"
        class="text3"
        v-model="inputText"
        placeholder="在此输入提示词"
        :disabled="isGenerating"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @input="handleInput"
        @confirm="handleGenerate"
        type="textarea"
        auto-height="true"
        :maxlength="MAX_LENGTH"
        confirm-type="send"
        clearable="true"
        confirm-hold="false"
        hold-keyboard="false"
      />
      <!-- 字符计数显示 -->
      <view class="char-count" v-if="inputText.length > 0">
        {{ inputText.length }}/{{ MAX_LENGTH }}
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'
// defineEmits is a compiler macro, no import needed

// 常量定义
const MAX_LENGTH = 260

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
        // uni-easyinput 使用 focus 方法
        if (inputRef.value && typeof inputRef.value.focus === 'function') {
          inputRef.value.focus()
        }
      } catch (error) {
        console.warn('Failed to focus input:', error)
      }
    })
  }
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

const handleInputFocus = () => {
  inputFocused.value = true
}

const handleInputBlur = () => {
  inputFocused.value = false
}

// 处理输入变化，确保不超过最大长度
const handleInput = (event) => {
  const value = event.detail.value || event.target.value
  
  // 如果输入超过最大长度，截断到最大长度
  if (value.length > 500) {
    inputText.value = value.substring(0, 500)
    
    // 在下一个tick中更新输入框的值，确保UI同步
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.value = inputText.value
      }
    })
  } else {
    inputText.value = value
  }
}

// 暴露方法给父组件
defineExpose({
  focusInput
})
</script>

<style scoped>
.frame20 {
  display: flex;
  align-items: flex-end; /* 改为底部对齐，让内容固定在底部 */
  justify-content: center;
  padding: 0 12px 12px 16px;
  width: 100%;
  min-height: 70px; /* 1行 + 外层padding: 46px + 24px = 70px */
  max-height: 158px; /* 5行 + 外层padding: 134px + 24px = 158px */
  background: #f4f0eb;
  position: relative; /* 改为相对定位，让父容器控制位置 */
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.frame21 {
  display: flex;
  align-items: flex-start;
  border-radius: 20px;
  background: #dddddd;
  padding: 12px 16px;
  flex: 1;
  min-width: 0;
  min-height: 46px; /* 1行 + padding: 22px + 24px = 46px */
  max-height: 134px; /* 5行 + padding: 110px + 24px = 134px */
  transition: all 0.2s ease;
  position: relative;
  box-sizing: border-box;
}

.text3 {
  flex: 1;
  width: 100%;
  min-height: 22px; /* 1行的高度 */
  max-height: 110px; /* 5行的高度: 22px * 5 = 110px */
  line-height: 22px;
  font-size: 14px;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  color: rgba(0, 0, 0, 0.3);
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto; /* 启用垂直滚动 */
  overflow-x: hidden; /* 隐藏水平滚动 */
  word-wrap: break-word;
  word-break: break-all;
  box-sizing: border-box;
}

.text3:focus {
  color: #000000 !important;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 8px;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
}

/* uni-easyinput 内部样式调整 */
.text3 :deep(.uni-easyinput) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.text3 :deep(.uni-easyinput__content) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.text3 :deep(.uni-easyinput__content-textarea) {
  line-height: 22px !important;
  letter-spacing: 0 !important;
  color: rgba(0, 0, 0, 0.3) !important;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif !important;
  font-size: 14px !important;
  border: none !important;
  background: transparent !important;
  outline: none !important;
  min-height: 22px !important;
  max-height: 110px !important; /* 5行 * 22px */
  resize: none !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
}

.text3 :deep(.uni-easyinput__content-textarea:focus) {
  color: #000000 !important;
}

.text3 :deep(.uni-easyinput__placeholder-class) {
  color: rgba(0, 0, 0, 0.3) !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 22px !important;
  letter-spacing: 0 !important;
}

.frame21:active {
  background: #cccccc;
}

/* 响应式媒体查询 */
@media screen and (max-width: 480px) {
  .frame20 {
    padding: 0 10px 15px 10px;
    min-height: 62px; /* 调整为适应新的高度计算 */
    max-height: 146px;
  }
  
  .frame21 {
    /* padding: 10px 14px; */
    min-width: 0;
    min-height: 42px; /* 调整为适应新的高度计算 */
    max-height: 124px;
  }
  
  .text3 {
    font-size: 13px !important;
    max-height: 100px !important; /* 5行 * 20px = 100px (小屏幕行高调整) */
    line-height: 20px !important;
  }
}

@media screen and (min-width: 768px) {
  .frame20 {
    padding: 0 10px 15px 10px;
    min-height: 70px;
    max-height: 158px;
  }
  
  .frame21 {
    padding: 12px 20px;
    min-width: 0;
    min-height: 46px;
    max-height: 134px;
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