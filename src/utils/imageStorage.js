/**
 * 图片存储工具类
 * 用于下载、保存和管理AI生成的图片
 */
class ImageStorage {
  constructor() {
    this.storageKey = 'saved_images'
    this.metadataKey = 'image_metadata'
  }

  /**
   * 下载并保存图片到本地
   * @param {string} imageUrl - 图片URL
   * @param {Object} metadata - 图片元数据
   * @returns {Promise<string>} 本地图片路径
   */
  // 备用保存方法
  fallbackSaveFile(tempFilePath, resolve, reject) {
    if (uni.saveFile) {
      uni.saveFile({
        tempFilePath: tempFilePath,
        success: (res) => {
          console.log('图片保存成功:', res.savedFilePath)
          resolve(res)
        },
        fail: (err) => {
          console.error('图片保存失败:', err)
          const errorMsg = err.errMsg || err.message || '存储错误'
          reject(new Error(`图片保存失败: ${errorMsg}`))
        }
      })
    } else {
      // 如果saveFile也不支持，直接使用临时文件路径
      console.warn('saveFile不支持，使用临时文件路径')
      resolve({ savedFilePath: tempFilePath })
    }
  }

  async saveImage(imageUrl, metadata = {}) {
    try {
      // 验证图片URL
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('无效的图片URL')
      }
      
      console.log('开始下载图片:', imageUrl)
      
      // 生成唯一的文件名
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const fileName = `ai_image_${timestamp}_${random}.jpg`
      
      // 下载图片
      const downloadResult = await new Promise((resolve, reject) => {
        uni.downloadFile({
          url: imageUrl,
          timeout: 30000, // 30秒超时
          success: (res) => {
            console.log('图片下载成功:', res.tempFilePath)
            if (res.statusCode === 200) {
              resolve(res)
            } else {
              reject(new Error(`下载失败，状态码: ${res.statusCode}`))
            }
          },
          fail: (err) => {
            console.error('图片下载失败:', err)
            const errorMsg = err.errMsg || err.message || '网络错误'
            reject(new Error(`图片下载失败: ${errorMsg}`))
          }
        })
      })

      // 保存图片到本地永久目录
      const savedPath = await new Promise((resolve, reject) => {
        // 直接使用saveFile，避免iOS兼容性问题
        this.fallbackSaveFile(downloadResult.tempFilePath, resolve, reject)
      })

      // 保存图片元数据
      const imageMetadata = {
        id: timestamp,
        fileName,
        localPath: savedPath.savedFilePath,
        originalUrl: imageUrl,
        saveTime: new Date().toISOString(),
        ...metadata
      }

      await this.saveImageMetadata(imageMetadata)

      return savedPath.savedFilePath
    } catch (error) {
      console.error('保存图片失败:', error)
      throw error
    }
  }

  /**
   * 批量保存图片
   * @param {Array} imageUrls - 图片URL数组
   * @param {Object} commonMetadata - 公共元数据
   * @returns {Promise<Array>} 本地图片路径数组
   */
  async saveImages(imageUrls, commonMetadata = {}) {
    const savedPaths = []
    const failedUrls = []
    
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const imageUrl = imageUrls[i]
        const metadata = {
          ...commonMetadata,
          index: i + 1,
          totalCount: imageUrls.length
        }
        
        const savedPath = await this.saveImage(imageUrl, metadata)
        savedPaths.push(savedPath)
        
        console.log(`图片 ${i + 1}/${imageUrls.length} 保存成功`)
        
      } catch (error) {
        console.error(`图片 ${i + 1} 保存失败:`, error)
        failedUrls.push(imageUrls[i])
        
        // 即使单张图片失败，也继续保存其他图片
        continue
      }
    }
    
    // 如果有失败的图片，抛出包含详细信息的错误
    if (failedUrls.length > 0) {
      const error = new Error(`${failedUrls.length}/${imageUrls.length} 张图片保存失败`)
      error.failedUrls = failedUrls
      error.savedPaths = savedPaths
      error.partialSuccess = savedPaths.length > 0
      throw error
    }
    
    return savedPaths
  }

  /**
   * 保存图片元数据
   * @param {Object} metadata - 图片元数据
   */
  async saveImageMetadata(metadata) {
    try {
      const existingMetadata = this.getImageMetadata()
      existingMetadata.unshift(metadata) // 新图片添加到开头
      
      uni.setStorageSync(this.metadataKey, existingMetadata)
      console.log('图片元数据保存成功:', metadata)
    } catch (error) {
      console.error('保存图片元数据失败:', error)
      throw error
    }
  }

  /**
   * 获取所有图片元数据
   * @returns {Array} 图片元数据数组
   */
  getImageMetadata() {
    try {
      return uni.getStorageSync(this.metadataKey) || []
    } catch (error) {
      console.error('获取图片元数据失败:', error)
      return []
    }
  }

  /**
   * 根据ID获取图片元数据
   * @param {number} id - 图片ID
   * @returns {Object|null} 图片元数据
   */
  getImageMetadataById(id) {
    try {
      const metadata = this.getImageMetadata()
      return metadata.find(item => item.id === id) || null
    } catch (error) {
      console.error('获取图片元数据失败:', error)
      return null
    }
  }

  /**
   * 删除图片及其元数据
   * @param {number} id - 图片ID
   */
  async deleteImage(id) {
    try {
      const metadata = this.getImageMetadataById(id)
      if (!metadata) {
        throw new Error('图片不存在')
      }

      // 删除本地文件
      await uni.removeSavedFile({
        filePath: metadata.localPath,
        success: () => {
          console.log('本地图片文件删除成功')
        },
        fail: (err) => {
          console.warn('删除本地图片文件失败:', err)
        }
      })

      // 删除元数据
      const allMetadata = this.getImageMetadata()
      const filteredMetadata = allMetadata.filter(item => item.id !== id)
      uni.setStorageSync(this.metadataKey, filteredMetadata)
      
      console.log('图片删除成功:', id)
    } catch (error) {
      console.error('删除图片失败:', error)
      throw error
    }
  }

  /**
   * 清除所有保存的图片
   */
  async clearAllImages() {
    try {
      const metadata = this.getImageMetadata()
      
      // 删除所有本地文件
      for (const item of metadata) {
        try {
          await uni.removeSavedFile({
            filePath: item.localPath
          })
        } catch (err) {
          console.warn('删除文件失败:', item.localPath, err)
        }
      }
      
      // 清除元数据
      uni.removeStorageSync(this.metadataKey)
      
      console.log('所有图片已清除')
    } catch (error) {
      console.error('清除图片失败:', error)
      throw error
    }
  }

  /**
   * 获取存储统计信息
   * @returns {Object} 存储统计
   */
  getStorageStats() {
    try {
      const metadata = this.getImageMetadata()
      return {
        totalImages: metadata.length,
        oldestImage: metadata.length > 0 ? metadata[metadata.length - 1].saveTime : null,
        newestImage: metadata.length > 0 ? metadata[0].saveTime : null
      }
    } catch (error) {
      console.error('获取存储统计失败:', error)
      return {
        totalImages: 0,
        oldestImage: null,
        newestImage: null
      }
    }
  }
}

// 导出单例实例
export const imageStorage = new ImageStorage()
export default ImageStorage