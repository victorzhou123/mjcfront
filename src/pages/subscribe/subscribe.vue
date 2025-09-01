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
      <div class="frame559">
        <div class="vip-line12">
          <img src="/static/mezlhoga-n8hj0kb.svg" class="icon" />
        </div>
        <div class="text2">海量绘画次数</div>
      </div>
      <div class="frame559">
        <div class="vip-line12">
          <img src="/static/mezlhoga-x0f1cdk.svg" class="icon" />
        </div>
        <div class="text2">云端存储</div>
      </div>
    </div>
    
    <!-- 会员套餐区域 -->
    <div class="frame572">
      <div class="frame570">
        <div class="frame566">
          <div class="text3">年度会员</div>
          <div class="price">¥ 498</div>
          <div class="text4">¥ 1.3 / 天</div>
        </div>
        <div class="frame566">
          <div class="text3">季度会员</div>
          <div class="price">¥ 168</div>
          <div class="text4">¥ 1.8 / 天</div>
        </div>
      </div>
      <div class="frame571">
        <div class="frame566">
          <div class="text3">月费会员</div>
          <div class="price">¥ 78</div>
          <div class="text4">¥ 2.5 / 天</div>
        </div>
        <div class="frame566">
          <div class="text3">周费会员</div>
          <div class="price">¥ 38</div>
          <div class="text4">¥ 5.4 / 天</div>
        </div>
      </div>
    </div>
    
    <!-- 底部订阅按钮区域 -->
    <div class="frame576">
      <div class="frame574">
        <div class="frame573" @click="subscribe">
          <div class="text3">立即订阅</div>
        </div>
      </div>
      <div class="text5" @click="restorePurchase">恢复购买</div>
    </div>
  </div>
</template>

<script setup>
import BackButton from '@/components/BackButton.vue'

// 订阅功能
const subscribe = () => {
  // TODO: 实现订阅功能
  console.log('立即订阅')
}

// 恢复购买
const restorePurchase = () => {
  // TODO: 实现恢复购买功能
  console.log('恢复购买')
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
  align-items: center;
  align-self: stretch;
  justify-content: center;
  column-gap: 37px;
  margin: 30px 20px;
  width: calc(100% - 40px);
  padding: 20px;
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
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: rgba(255, 130, 12, 0.3);
  min-height: 100px;
  padding: 10px;
}

.vip-line1 {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  overflow: hidden;
}

.frame559 {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: rgba(255, 130, 12, 0.3);
  min-height: 100px;
  padding: 10px;
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
  align-self: stretch;
  margin-top: 64px;
  row-gap: 37px;
  width: 100%;
  padding: 0 20px;
}

.frame566 {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  border-radius: 15px;
  background: rgba(255, 130, 12, 0.3);
  padding: 15px 10px;
  row-gap: 10px;
  min-width: 120px;
  max-width: 200px;
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

.frame570 {
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  column-gap: 20px;
  flex-wrap: wrap;
  row-gap: 20px;
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
  color: #000000;
  font-family: "SF Pro", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif;
  font-size: 16px;
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
    flex-direction: column;
    row-gap: 15px;
    margin: 30px auto;
    padding: 15px;
    max-width: 350px;
  }
  
  .frame558, .frame559 {
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }
  
  .frame572 {
    margin: 40px auto 0;
    row-gap: 25px;
    max-width: 350px;
    padding: 0 10px;
  }
  
  .frame576 {
    margin: 60px auto 30px;
    max-width: 350px;
    padding: 0 10px;
  }
  
  .frame570, .frame571 {
    flex-direction: column;
    row-gap: 20px;
    align-items: center;
  }
  
  .frame566 {
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }
  
  .text {
    font-size: 18px;
    padding: 20px 15px;
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
    max-width: 500px;
    margin: 30px auto;
    padding: 20px;
  }
  
  .frame572 {
    max-width: 500px;
    margin: 64px auto 0;
    padding: 0 15px;
  }
  
  .frame576 {
    max-width: 500px;
    margin: 84px auto 35px;
    padding: 0 15px;
  }
  
  .frame570, .frame571 {
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
    max-width: 600px;
    margin: 30px auto;
    padding: 20px;
  }
  
  .frame572 {
    max-width: 600px;
    margin: 64px auto 0;
    padding: 0 20px;
  }
  
  .frame576 {
    max-width: 600px;
    margin: 84px auto 40px;
    padding: 0 20px;
  }
  
  .frame570, .frame571 {
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
</style>