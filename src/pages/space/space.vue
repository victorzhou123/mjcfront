<template>
  <view class="space">
    <!-- 顶部标题栏 -->
    <TopHeader title="我的空间" :showSettings="true" />
    
    <!-- 主要内容区域 -->
    <view class="auto-wrapper">
      <scroll-view class="frame554" scroll-y="true">
        <!-- 图片网格布局 -->
        <view class="image-grid">
          <view 
            v-for="(image, index) in userImages" 
            :key="image.id" 
            class="image-item"
            @tap="directPreviewImage(image)"
          >
            <image 
              :src="image.url" 
              class="grid-image" 
              mode="aspectFill"
              @error="handleImageError(index)"
            />
            <view class="image-overlay">
              <text class="image-date">{{ image.date }}</text>
              <view v-if="image.imageCount > 1" class="image-count">
                <text class="count-text">{{ image.index }}/{{ image.imageCount }}</text>
              </view>
            </view>
            <view v-if="image.prompt" class="image-prompt">
              <text class="prompt-text">{{ image.prompt.length > 20 ? image.prompt.substring(0, 20) + '...' : image.prompt }}</text>
            </view>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-if="!userImages || userImages.length === 0" class="empty-state">
          <image src="/static/empty-space.svg" class="empty-icon" mode="aspectFit" />
          <text class="empty-text">还没有生成任何作品</text>
          <text class="empty-subtitle">去AI绘图页面创作你的第一幅作品吧！</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 底部导航栏 -->
    <BottomNavigation class="bottom" current-page="space" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import TopHeader from '@/components/TopHeader.vue'
import { imageStorage } from '@/utils/imageStorage.js'
import { saveToAlbum, deleteImage } from '@/utils/imageActions.js'

// 响应式数据
const userImages = ref([])

// 页面加载时获取用户图片
onMounted(() => {
  loadUserImages()
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '今天'
  } else if (diffDays === 2) {
    return '昨天'
  } else if (diffDays <= 7) {
    return `${diffDays - 1}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }
}

// 加载用户图片
const loadUserImages = () => {
  try {
    console.log('开始加载本地保存的图片')
    
    // 从本地存储获取图片元数据
    const imageMetadata = imageStorage.getImageMetadata()
    console.log('获取到的图片元数据:', imageMetadata)
    
    // 转换为页面需要的格式
    userImages.value = imageMetadata.map(item => ({
      id: item.id,
      url: item.localPath,
      originalUrl: item.originalUrl,
      date: formatDate(item.saveTime),
      prompt: item.prompt,
      saveTime: item.saveTime,
      imageCount: item.imageCount,
      index: item.index
    }))
    
    // 如果没有图片数据，添加一些测试数据（仅用于开发测试）
    if (userImages.value.length === 0) {
      console.log('没有找到本地保存的图片')
    }
    
  } catch (error) {
    console.error('加载图片失败:', error)
    userImages.value = []
    
    uni.showToast({
      title: '加载图片失败',
      icon: 'none',
      duration: 2000
    })
  }
}

// 直接预览图片（点击时）
const directPreviewImage = (image) => {
  uni.previewImage({
    urls: userImages.value.map(img => img.url),
    current: image.url,
    showmenu: true,
    longPressActions: {
      itemList: ['保存图片', '删除图片'],
      success: function(data) {
        console.log('data in space: ', data)


        if (data.tapIndex === 0) {
          saveToAlbum(image.url)
        } else if (data.tapIndex === 1) {
          deleteImage(image, loadUserImages)
        }
      },
      fail: function(err) {
        console.log(err.errMsg);
      }
    }
  })
}

// 处理图片加载错误
const handleImageError = (index) => {
  console.log(`图片加载失败: ${index}`)
  // 可以设置默认图片或移除该项
}


</script>

<style scoped>
.space {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f4f0eb;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.auto-wrapper {
  position: absolute;
  bottom: 12%;
  height: 75%;
  width: 100%;
  /* padding: 0 20vw; */
  display: flex;
  flex-direction: column;
}

.frame554 {
  flex: 1;
  width: 100%;
  padding: 0 20vw;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 3vw;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

/* 媒体查询 - 手机设备 */
@media (max-width: 480px) {
  .frame554 {
    padding: 0 3vw;
  }
  
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5vw;
  }
}

/* 媒体查询 - 平板设备 */
@media (min-width: 481px) and (max-width: 768px) {
  .frame554 {
    padding: 0 3.5vw;
  }
  
  .image-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5vw;
  }
}

/* 媒体查询 - 桌面设备 */
@media (min-width: 769px) {
  .frame554 {
    padding: 0 2vw;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .image-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2vw;
    max-width: 1000px;
  }
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #e0e0e0;
}

.grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.image-date {
  color: white;
  font-size: 10px;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
}

.image-count {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 2px 6px;
}

.count-text {
  color: white;
  font-size: 9px;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
}

.image-prompt {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.6), transparent);
  padding: 8px;
}

.prompt-text {
  color: white;
  font-size: 9px;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  line-height: 1.2;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 400px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
}

.empty-subtitle {
  font-size: 14px;
  color: #999;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
}


</style>