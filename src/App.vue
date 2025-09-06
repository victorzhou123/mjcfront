<script>
import { baseComponent } from '@/utils/base.js'
import { user } from '@/utils/user.js'

export default {
  onLaunch: async function () {
    console.log('App Launch')
    // 初始化BaseComponent实例
    try {
      await baseComponent.init()
      console.log('BaseComponent初始化成功')
    } catch (error) {
      console.error('BaseComponent初始化失败:', error)
    }
    
    // 初始化User实例
    try {
      user.init()
      console.log('User初始化成功')
    } catch (error) {
      console.error('User初始化失败:', error)
    }

    console.log('transactionId', user.transactionId)
    console.log('uuid', user.uuid)
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
</style>
