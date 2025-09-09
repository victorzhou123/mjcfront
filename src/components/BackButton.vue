<template>
  <view class="back-button" @click="handleGoBack">
    <image :src="iconSrc" class="chevron-left" />
  </view>
</template>

<script setup>
// defineProps and defineEmits are compiler macros, no import needed

// 定义props
const props = defineProps({
  // 图标路径，默认使用chevron-left.svg
  iconSrc: {
    type: String,
    default: '/static/chevron-left.svg'
  },
  // 默认返回页面路径
  defaultRoute: {
    type: String,
    default: '/pages/space/space'
  }
})

// 定义事件
const emit = defineEmits(['back'])

// 返回处理函数
const handleGoBack = () => {
  // 触发自定义事件，允许父组件自定义返回逻辑
  emit('back')
  
  // 默认返回逻辑
  // #ifdef H5
  if (window.history.length > 1) {
    window.history.back()
  } else {
    // 如果没有历史记录，跳转到默认页面
    uni.reLaunch({
      url: props.defaultRoute
    })
  }
  // #endif
  
  // #ifndef H5
  uni.navigateBack()
  // #endif
}
</script>

<style scoped>
.back-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: calc(env(safe-area-inset-top) + 20px) 20px 10px 20px;
  cursor: pointer;
  align-self: flex-start;
}

.chevron-left {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  overflow: hidden;
}
</style>