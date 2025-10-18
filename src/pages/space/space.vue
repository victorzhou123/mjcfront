<template>
  <view class="space">
    <!-- 顶部标题栏 -->
    <TopHeader title="我的空间" :showSettings="true" />
    
    <!-- 主要内容区域 -->
    <view class="auto-wrapper">
      <scroll-view class="frame554" scroll-y="true" @scrolltolower="loadMoreImages">
        <!-- 图片网格布局 -->
        <view class="image-grid" v-if="!loading">
          <view 
            v-for="(image, index) in userImages" 
            :key="image.id" 
            class="image-item"
            @tap="directPreviewImage(image)"
          >
            <image 
              :src="image.url || image.originalUrl"
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
        
        <!-- 加载状态 -->
        <view v-if="loading" class="loading-state">
          <text class="loading-text">正在加载作品...</text>
        </view>
        
        <!-- 加载更多状态 -->
        <view v-if="loadingMore" class="loading-more-state">
          <text class="loading-more-text">正在加载更多...</text>
        </view>
        
        <!-- 没有更多数据提示 -->
        <view v-if="!loading && !loadingMore && !hasMore && userImages.length > 0" class="no-more-state">
          <text class="no-more-text">没有更多作品了</text>
        </view>
        
        <!-- 空状态 -->
        <view v-if="!loading && (!userImages || userImages.length === 0)" class="empty-state">
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
import { space } from '@/utils/space.js'

// 响应式数据
const userImages = ref([])
const loading = ref(false)
const error = ref(null)

// 分页相关数据
const currentPage = ref(1)
const hasMore = ref(true)
const nextPageUrl = ref(null)
const loadingMore = ref(false)

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
const loadUserImages = async (isLoadMore = false) => {
  try {
    // 如果是加载更多，设置loadingMore状态
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
      // 重置分页数据
      currentPage.value = 1
      hasMore.value = true
      nextPageUrl.value = null
      userImages.value = []
    }
    
    error.value = null
    console.log('开始获取用户作品', isLoadMore ? '(加载更多)' : '(首次加载)')
    
    // 使用space.js的getUserWorks方法获取远程作品数据
    const response = await space.getUserWorks({
      page: currentPage.value,
      per_page: 20  // 每页20个作品
    })
    
    console.log('获取到的作品数据:', response)
    
    // 转换API数据为页面需要的格式
    const works = response.data || []
    const newImages = []

    console.log('原始作品数据:', works)
    
    // 处理每个作品的图片
    works.forEach(work => {
      const images = work.images || []
      const prompt = work.content?.prompt || ''
      
      // 为每张图片创建一个显示项
      images.forEach((imageUrl, index) => {
        // 检查图片是否已经保存在本地，如果没有的话就尝试保存到本地
        const localUrl = getImageLocalUrl(imageUrl)
        if (!localUrl) {
          saveImageToLocal(imageUrl, work.created_at || work.updated_at)
        }

        newImages.push({
          id: `${work.id}_${index}`, // 组合ID确保唯一性
          workId: work.id,
          url: localUrl || imageUrl,
          originalUrl: imageUrl,
          date: formatDate(work.created_at || work.updated_at),
          prompt: prompt,
          saveTime: work.created_at || work.updated_at,
          imageCount: images.length,
          index: index + 1,
          status: work.status,
          type: work.type
        })
      })
    })
    
    console.log('转换后的图片数据:', newImages)
    
    // 根据是否是加载更多来决定如何处理数据
    if (isLoadMore) {
      userImages.value = [...userImages.value, ...newImages]
    } else {
      userImages.value = newImages
    }
    
    // 处理分页信息
    if (response.pager) {
      currentPage.value = response.pager.current_page
      hasMore.value = !!response.pager.next_page_url
      nextPageUrl.value = response.pager.next_page_url
      
      console.log('分页信息:', {
        currentPage: currentPage.value,
        hasMore: hasMore.value,
        nextPageUrl: nextPageUrl.value
      })
    } else {
      hasMore.value = false
    }

    console.log('更新后的userImages:', userImages.value)
    
    // 如果没有作品数据且是首次加载，尝试从本地存储获取
    if (userImages.value.length === 0 && !isLoadMore) {
      console.log('没有找到远程作品，尝试从本地存储获取')
      await loadLocalImages()
    }
    
  } catch (error) {
    console.error('获取用户作品失败:', error)
    error.value = error.message || '获取作品失败'
    
    // 发生错误时，如果是首次加载，尝试从本地存储获取
    if (!isLoadMore) {
      console.log('API获取失败，尝试从本地存储获取')
      await loadLocalImages()
      
      uni.showToast({
        title: '获取作品失败，显示本地缓存',
        icon: 'none',
        duration: 2000
      })
    } else {
      uni.showToast({
        title: '加载更多失败',
        icon: 'none',
        duration: 2000
      })
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 加载更多图片
const loadMoreImages = async () => {
  // 如果没有更多数据或正在加载中，则不执行
  if (!hasMore.value || loadingMore.value || loading.value) {
    return
  }
  
  console.log('触发加载更多')
  
  // 增加页码
  currentPage.value += 1
  
  // 调用loadUserImages方法加载更多数据
  await loadUserImages(true)
}

// 查询图片本地URL，如果没有的话就返回null
const getImageLocalUrl = (imageUrl) => {
  return imageStorage.getImageMetadataByUrl(imageUrl)?.localPath || null
}

// 查询图片是否已保存在本地，如果没有保存的话就保存到本地
const saveImageToLocal = async (imageUrl, date) => {
  if (!getImageLocalUrl(imageUrl)) {
    console.log(`图片 ${imageUrl} 不在本地存储中，尝试保存`)
    await imageStorage.saveImage(imageUrl, {saveTime: date})
  }
}

// 从本地存储加载图片（作为备用方案）
const loadLocalImages = async () => {
  try {
    console.log('从本地存储获取图片')
    
    // 从本地存储获取图片元数据
    const imageMetadata = imageStorage.getImageMetadata()
    console.log('获取到的本地图片元数据:', imageMetadata)
    
    // 由于imageStorage现在返回对象格式，需要转换为数组
    const metadataArray = Object.values(imageMetadata)
    
    // 转换为页面需要的格式
    const localImages = metadataArray.map(item => ({
      id: item.id,
      url: item.localPath,
      originalUrl: item.originalUrl,
      date: formatDate(item.saveTime),
      prompt: item.prompt,
      saveTime: item.saveTime,
      imageCount: item.imageCount,
      index: item.index
    }))
    
    // 如果当前没有图片或者本地图片更多，则使用本地图片
    if (userImages.value.length === 0) {
      userImages.value = localImages
    }
    
  } catch (error) {
    console.error('加载本地图片失败:', error)
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
  console.log(`图片 ${index} 加载失败`);
  // 可以在这里设置默认图片或重试逻辑
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

/* 加载状态样式 */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

/* 加载更多状态样式 */
.loading-more-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;
}

.loading-more-text {
  font-size: 24rpx;
  color: #999;
}

/* 没有更多数据状态样式 */
.no-more-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #ccc;
}

.empty-subtitle {
  font-size: 14px;
  color: #999;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
}


</style>