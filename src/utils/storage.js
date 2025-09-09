/**
 * 本地存储工具类
 * 用于保存和读取对话记录
 */
class Storage {
  constructor() {
    this.CHAT_HISTORY_KEY = 'chat_history'
  }

  /**
   * 保存对话记录到本地存储
   * @param {Array} userMessages 用户消息数组
   * @param {Array} aiReplies AI回复数组
   */
  saveChatHistory(userMessages, aiReplies) {
    try {
      const chatData = {
        userMessages: userMessages || [],
        aiReplies: aiReplies || [],
        lastUpdated: new Date().toISOString()
      }
      
      uni.setStorageSync(this.CHAT_HISTORY_KEY, JSON.stringify(chatData))
      console.log('对话记录已保存到本地存储')
    } catch (error) {
      console.error('保存对话记录失败:', error)
    }
  }

  /**
   * 从本地存储读取对话记录
   * @returns {Object} 包含用户消息和AI回复的对象
   */
  loadChatHistory() {
    try {
      const chatDataStr = uni.getStorageSync(this.CHAT_HISTORY_KEY)
      
      if (!chatDataStr) {
        console.log('没有找到本地对话记录')
        return {
          userMessages: [],
          aiReplies: []
        }
      }
      
      const chatData = JSON.parse(chatDataStr)
      console.log('成功加载本地对话记录:', chatData.lastUpdated)
      
      return {
        userMessages: chatData.userMessages || [],
        aiReplies: chatData.aiReplies || []
      }
    } catch (error) {
      console.error('读取对话记录失败:', error)
      return {
        userMessages: [],
        aiReplies: []
      }
    }
  }

  /**
   * 清除所有对话记录
   */
  clearChatHistory() {
    try {
      uni.removeStorageSync(this.CHAT_HISTORY_KEY)
      console.log('对话记录已清除')
    } catch (error) {
      console.error('清除对话记录失败:', error)
    }
  }

  /**
   * 获取存储的数据大小（字节）
   * @returns {number} 数据大小
   */
  getStorageSize() {
    try {
      const chatDataStr = uni.getStorageSync(this.CHAT_HISTORY_KEY)
      return chatDataStr ? new Blob([chatDataStr]).size : 0
    } catch (error) {
      console.error('获取存储大小失败:', error)
      return 0
    }
  }
}

// 创建并导出storage实例
const storage = new Storage()
export { Storage, storage }