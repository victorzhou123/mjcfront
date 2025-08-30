<template>
  <view class="space">
    <!-- 顶部标题栏 -->
    <TopHeader title="我的空间" />
    
    <!-- 主要内容区域 -->
    <view class="auto-wrapper">
      <scroll-view class="frame554" scroll-y="true">
        <!-- 图片网格布局 -->
        <view class="image-grid">
          <view 
            v-for="(image, index) in userImages" 
            :key="index" 
            class="image-item"
            @tap="previewImage(image.url)"
          >
            <image 
              :src="image.url" 
              class="grid-image" 
              mode="aspectFill"
              @error="handleImageError(index)"
            />
            <view class="image-overlay">
              <text class="image-date">{{ image.date }}</text>
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
    <BottomNavigation current-page="space" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import TopHeader from '@/components/TopHeader.vue'

// 响应式数据
const userImages = ref([])

// 模拟用户生成的图片数据
const mockImages = [
  {
    url: '/static/WechatIMG100.jpeg',
    date: '2024-01-15'
  },
  {
    url: '/static/sample1.jpg',
    date: '2024-01-14'
  },
  {
    url: '/static/sample2.jpg',
    date: '2024-01-13'
  },
  {
    url: '/static/sample3.jpg',
    date: '2024-01-12'
  },
  {
    url: '/static/sample4.jpg',
    date: '2024-01-11'
  },
  {
    url: '/static/sample5.jpg',
    date: '2024-01-10'
  }
]

// 页面加载时获取用户图片
onMounted(() => {
  loadUserImages()
})

// 加载用户图片
const loadUserImages = () => {
  // 这里应该从后端API获取用户的图片
  // 暂时使用模拟数据
  userImages.value = mockImages
}

// 预览图片
const previewImage = (imageUrl) => {
  if (!userImages.value || !Array.isArray(userImages.value)) {
    console.warn('userImages is not available for preview')
    return
  }
  
  uni.previewImage({
    urls: userImages.value.map(img => img.url),
    current: imageUrl
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
  top: 44px;
  bottom: 67px;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.frame554 {
  flex: 1;
  width: 100%;
  padding: 4vw;
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
    padding: 3vw;
  }
  
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5vw;
  }
}

/* 媒体查询 - 平板设备 */
@media (min-width: 481px) and (max-width: 768px) {
  .frame554 {
    padding: 3.5vw;
  }
  
  .image-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5vw;
  }
}

/* 媒体查询 - 桌面设备 */
@media (min-width: 769px) {
  .frame554 {
    padding: 2vw;
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
  align-items: flex-end;
}

.image-date {
  color: white;
  font-size: 10px;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
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