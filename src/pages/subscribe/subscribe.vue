<template>
  <div class="subscribe">
    <!-- 返回按钮 -->
    <BackButton icon-src="/static/mezlhoga-cuvmu7v.svg" default-route="/pages/setting/setting" />
    
    <!-- 标题 -->
    <div class="text">解锁以下全部功能</div>
    
    <!-- 功能图标区域 -->
    <div class="frame561">
      <div class="frame558">
        <img src="/static/mezlhoga-u3wpw94.svg" class="vip-line1" />
        <div class="text2">快速通道</div>
      </div>
      <div class="frame558">
        <div class="vip-line12">
          <img src="/static/mezlhoga-n8hj0kb.svg" class="icon" />
        </div>
        <div class="text2">海量绘画次数</div>
      </div>
      <div class="frame558">
        <div class="vip-line12">
          <img src="/static/mezlhoga-x0f1cdk.svg" class="icon" />
        </div>
        <div class="text2">云端存储</div>
      </div>
    </div>
    
    <!-- 会员套餐区域 -->
    <div class="frame572">
      <div class="frame575">
        <div 
          v-for="(plan, index) in planData.slice(0, 2)" 
          :key="plan.key"
          class="frame566" 
          :class="{ selected: selectedPlan === plan.key }" 
          @click="selectPlan(plan.key)"
        >
          <div class="text3">{{ plan.title }}</div>
          <div class="price">¥ {{ plan.priceNum }}</div>
          <div class="text4">¥ {{ plan.perDay }} / 天</div>
        </div>
      </div>
      <div class="frame575">
        <div 
          v-for="(plan, index) in planData.slice(2, 4)" 
          :key="plan.key"
          class="frame566" 
          :class="{ selected: selectedPlan === plan.key }" 
          @click="selectPlan(plan.key)"
        >
          <div class="text3">{{ plan.title }}</div>
          <div class="price">¥ {{ plan.priceNum }}</div>
          <div class="text4">¥ {{ plan.perDay }} / 天</div>
        </div>
      </div>
    </div>
    
    <!-- 底部订阅按钮区域 -->
    <div class="frame576">
      <div class="frame574">
        <div class="frame573" 
             :class="{ disabled: isSubscribing || isRestoring }"
             @click="!isSubscribing && !isRestoring && subscribe()">
          <div class="text3">{{ isSubscribing ? '订阅中...' : '立即订阅' }}</div>
        </div>
      </div>
      <div class="text5" 
           :class="{ disabled: isSubscribing || isRestoring }"
           @click="!isSubscribing && !isRestoring && restorePurchase()">{{ isRestoring ? '恢复中...' : '恢复购买' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BackButton from '@/components/BackButton.vue'
import { IAP_PRODUCTS, iapManager } from '@/utils/ipa.js'

// 会员套餐选择状态
const selectedPlan = ref('yearly') // 默认选中年度会员

// 加载状态
const isRestoring = ref(false)
const isSubscribing = ref(false)

// 会员套餐数据
const planData = computed(() => {
  const plans = [
    { key: 'yearly', productId: 'mjc.vip.year' },
    { key: 'quarterly', productId: 'mjc.vip.quarter' },
    { key: 'monthly', productId: 'mjc.vip.month' },
    { key: 'weekly', productId: 'mjc.vip.week' }
  ]
  
  return plans.map(plan => ({
    ...plan,
    ...IAP_PRODUCTS[plan.productId]
  }))
})

// 会员套餐选择
const selectPlan = (plan) => {
  selectedPlan.value = plan
  console.log('选中套餐:', plan)
}

// 订阅功能
const subscribe = async () => {
  if (isSubscribing.value) {
    return; // 防止重复点击
  }
  
  try {
    // 获取当前选中的套餐信息
    const currentPlan = planData.value.find(plan => plan.key === selectedPlan.value)
    if (!currentPlan) {
      uni.showToast({
        title: '请选择套餐',
        icon: 'none'
      })
      return
    }

    console.log('开始订阅:', currentPlan.productId)
    isSubscribing.value = true
    
    // 显示加载提示
    uni.showLoading({
      title: '正在处理订阅...',
      mask: true
    })
    
    // 初始化IAP管理器
    await iapManager.init()
    
    // 调用购买产品方法
    const result = await iapManager.purchaseProduct(currentPlan.productId)
    
    console.log('订阅成功:', result)
    uni.showToast({
      title: '订阅成功',
      icon: 'success'
    })
    
  } catch (error) {
    console.error('订阅失败:', error)
    uni.showToast({
      title: error.message || '订阅失败',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
    isSubscribing.value = false
  }
}

// 恢复购买
const restorePurchase = async () => {
  if (isRestoring.value) {
    return; // 防止重复点击
  }
  
  console.log('恢复购买')
  isRestoring.value = true
  
  // 显示加载提示
  uni.showLoading({
    title: '正在恢复购买...',
    mask: true
  })
  
  try {
    await iapManager.init()
    
    const res = await iapManager.restoreTransactions()
    if (res.success) {
      uni.showToast({ title: '恢复购买成功', icon: 'success' });
    } else {
      uni.showToast({ title: '恢复购买失败', icon: 'none' });
    }
  } catch (err) {
    console.error('恢复购买失败:', err);
    uni.showToast({ title: '恢复购买失败', icon: 'none' });
  } finally {
    uni.hideLoading()
    isRestoring.value = false
  }
}
</script>

<style scoped>
.subscribe {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f4f0eb;
  padding-bottom: 71px;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  margin: 0 auto;
  box-sizing: border-box;
}

.text {
  padding: 10px 10px 26px 10px;
  width: 100%;
  text-align: center;
  line-height: 28px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 20px;
}

.frame561 {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  column-gap: 10px;
  margin: 30px 20px;
  width: 100%;
  /* padding: 20px; */
}

.text2 {
  flex-shrink: 0;
  align-self: stretch;
  padding: 10px;
  text-align: center;
  line-height: 22px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.frame558 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: rgba(255, 130, 12, 0.3);
  height: 86px;
  width: 100px;
}

.vip-line1 {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  overflow: hidden;
}

.vip-line12 {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 3px 2px;
  width: 44px;
  height: 44px;
  overflow: hidden;
  row-gap: 10px;
}

.icon {
  width: 24px;
  height: 24px;
}

.frame572 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  margin-top: 64px;
  gap: 37px;
  width: 100%;
}

.frame575 {
  display: flex;
  flex-direction: row;
  width: 70%;
  justify-content: center;
  gap: 20px;
}

.frame566 {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  background: rgba(255, 130, 12, 0.3);
  row-gap: 10px;
  width: 95px;
  height: 114px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.frame566:hover {
  background: rgba(255, 130, 12, 0.4);
  transform: translateY(-2px);
}

.frame566.selected {
  background: rgba(255, 130, 12, 0.6);
  border: 2px solid #ff820c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 130, 12, 0.3);
}

.text3 {
  flex-shrink: 0;
  text-align: center;
  line-height: 28px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 20px;
}

.price {
  flex-shrink: 0;
  text-align: center;
  line-height: 28px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.text4 {
  flex-shrink: 0;
  align-self: stretch;
  text-align: center;
  line-height: 28px;
  letter-spacing: 0;
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 16px;
}

.frame571 {
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  column-gap: 20px;
  flex-wrap: wrap;
  row-gap: 20px;
}

.frame576 {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  margin-top: 84px;
  margin-bottom: 40px;
  width: 100%;
  padding: 0 20px;
}

.frame574 {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  padding: 10px 30px;
  row-gap: 10px;
}

.frame573 {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  column-gap: 10px;
  border-radius: 999px;
  background: rgba(255, 130, 12, 0.2);
  padding: 10px;
  cursor: pointer;
}

.frame573:hover {
  background: rgba(255, 130, 12, 0.3);
}

.text5 {
  flex-shrink: 0;
  align-self: stretch;
  padding: 2px 10px;
  text-align: center;
  line-height: 28px;
  letter-spacing: 0;
  color: #909090;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 13px;
  cursor: pointer;
}

.text5:hover {
  color: #ff820c;
}

/* 响应式媒体查询 */
/* 小屏幕手机 (最大宽度 480px) */
@media (max-width: 480px) {
  .subscribe {
    padding: 0 10px;
  }
  
  .frame561 {
    flex-direction: row;
    margin: 30px auto;
  }
  
  .frame558 {
    max-width: 280px;
    margin: 0 auto;
  }
  
  .frame572 {
    margin: 40px auto 0;
  }
  
  .frame576 {
    margin: 60px auto 30px;
    max-width: 350px;
    padding: 0 10px;
  }
  
  .frame571 {
    flex-direction: column;
    row-gap: 20px;
    align-items: center;
  }
  
  .frame566 {
    max-width: 280px;
    margin: 0 auto;
  }
  
  .text {
    font-size: 18px;
    max-width: 350px;
    margin: 0 auto;
  }
  
  .text2 {
    font-size: 12px;
    padding: 8px;
  }
  
  .text3 {
    font-size: 16px;
  }
  
  .price {
    font-size: 14px;
  }
  
  .text4 {
    font-size: 14px;
  }
}

/* 中等屏幕 (481px - 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .subscribe {
    padding: 0 15px;
  }
  
  .frame561 {
    margin: 30px auto;
  }
  
  .frame572 {
    margin: 64px auto 0;
  }
  
  .frame576 {
    max-width: 500px;
    margin: 84px auto 35px;
    padding: 0 15px;
  }
  
  .frame571 {
    column-gap: 30px;
    justify-content: center;
  }
  
  .frame566 {
    min-width: 140px;
    max-width: 180px;
  }
  
  .text {
    font-size: 22px;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .text3 {
    font-size: 20px;
  }
}

/* 大屏幕 (769px 及以上) */
@media (min-width: 769px) {
  .subscribe {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .frame561 {
    margin: 30px auto;
  }
  
  .frame572 {
    margin: 64px auto 0;
  }
  
  .frame576 {
    max-width: 600px;
    margin: 84px auto 40px;
    padding: 0 20px;
  }
  
  .frame571 {
    column-gap: 40px;
    justify-content: center;
  }
  
  .frame566 {
    min-width: 160px;
    max-width: 200px;
  }
  
  .text {
    font-size: 24px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .text3 {
    font-size: 22px;
  }
}

/* 禁用状态样式 */
.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.frame573.disabled {
  background: #ccc !important;
}

.text5.disabled {
  color: #999 !important;
}
</style>