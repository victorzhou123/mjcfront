import { baseComponent } from './base.js';
import { MOCK_URL } from './config.js';

class User {
    constructor() {
        this.isInit = false
        this.channel = null
        this.uuid = ""
        this.transactionId = ""
        this.token = ""
        this.refreshToken = ""
        this.accessExpiresAt = 0
        this.refreshExpiresAt = 0
        this.userInfo = null
        this.apiBaseUrl = MOCK_URL; // 请根据实际API地址修改
    }

    async init() {
        if (this.isInit) {
            return
        }

        // 先尝试从本地存储加载用户信息
        const hasLocalUserInfo = this.loadUserInfo()
        
        if (!baseComponent.isInit) {
            await baseComponent.init()
        }

        this.transactionId = baseComponent.transactionId
        this.uuid = this.getUUID()

        this.isInit = true

        console.log('userinfo:', this.userInfo)

        // 智能处理token状态
        if (!hasLocalUserInfo) {
            console.log('没有本地用户信息，需要重新登录')
            try {
                await this.login()
            } catch (error) {
                console.error('登录失败:', error)
            }
        }
    }

    getUUID() {
        try {
            const deviceInfo = uni.getDeviceInfo()
            console.log('device info:', deviceInfo)
            return this.toUUID(deviceInfo.deviceId)
        } catch (error) {
            console.error('获取设备信息失败:', error)
            return null
        }
    }

    toUUID(s) {
        if (s == "") {
            return ""
        }
        return s.replace(/([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})/, '$1-$2-$3-$4-$5')
    }

    // 登录，请求后端
    async login() {
        if (!this.isInit) {
            console.warn('User未初始化，请先调用init()方法')
            return
        }

        if (!this.uuid) {
            throw new Error('缺少必要的登录参数: uuid')
        }

        try {
            console.log('开始执行登录请求')
            
            const deviceInfo = uni.getDeviceInfo()
            const systemInfo = uni.getSystemInfoSync()
            
            // 构建请求头
            const headers = {
                'Content-Type': 'application/json',
                'CLIENT-UDID': this.uuid,
                'CLIENT-PLATFORM': systemInfo.platform || 'unknown',
                'CLIENT-VERSION': '1.0.0', // 可以从manifest.json或其他地方获取
                'ACCEPT-LANGUAGE': 'zh-CN'
            }
            
            // 构建请求体
            const requestBody = {
                udid: this.uuid
            }
            
            // 如果transactionId存在，则添加到请求体中
            if (this.transactionId) {
                requestBody.origin_transaction_id = this.transactionId
            }
            
            console.log('登录请求参数:', { headers, requestBody })
            
            // 发送登录请求
            const response = await this.makeRequest('/v1/auth/login', {
                method: 'POST',
                headers: headers,
                data: requestBody
            })
            
            console.log('登录响应:', response)
            
            // 处理登录响应
            if (response.code === 200000 && response.data) {
                this.token = response.data.token
                this.refreshToken = response.data.refresh_token
                this.accessExpiresAt = response.data.access_expires_at
                this.refreshExpiresAt = response.data.refresh_expires_at
                this.userInfo = response.data.user
                
                // 保存用户信息到本地存储
                this.saveUserInfo()
                
                console.log('登录成功，用户信息:', this.userInfo)
                return response.data
            } else {
                throw new Error(response.message || '登录失败')
            }
            
        } catch (error) {
            console.error('登录请求失败:', error)
            throw error
        }
    }

    // 发送HTTP请求的通用方法
    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                url: this.apiBaseUrl + url,
                method: options.method || 'GET',
                header: options.headers || {},
                data: options.data || {},
                timeout: 30000,
                success: (res) => {
                    console.log('HTTP请求成功:', res)
                    if (res.statusCode === 200) {
                        resolve(res.data)
                    } else {
                        reject(new Error(`HTTP请求失败: ${res.statusCode}`))
                    }
                },
                fail: (error) => {
                    console.error('HTTP请求失败:', error)
                    reject(error)
                }
            }
            
            uni.request(requestOptions)
        })
    }
    
    // 保存用户信息到本地存储
    saveUserInfo() {
        try {
            const userInfoData = {
                token: this.token,
                refreshToken: this.refreshToken,
                accessExpiresAt: this.accessExpiresAt,
                refreshExpiresAt: this.refreshExpiresAt,
                userInfo: this.userInfo,
                uuid: this.uuid,
                transactionId: this.transactionId
            }
            
            uni.setStorageSync('userInfo', JSON.stringify(userInfoData))
            console.log('用户信息已保存到本地存储')
        } catch (error) {
            console.error('保存用户信息失败:', error)
        }
    }
    
    // 从本地存储加载用户信息
    loadUserInfo() {
        try {
            const userInfoStr = uni.getStorageSync('userInfo')
            if (userInfoStr) {
                const userInfoData = JSON.parse(userInfoStr)
                this.token = userInfoData.token || ''
                this.refreshToken = userInfoData.refreshToken || ''
                this.accessExpiresAt = userInfoData.accessExpiresAt || 0
                this.refreshExpiresAt = userInfoData.refreshExpiresAt || 0
                this.userInfo = userInfoData.userInfo || null
                this.uuid = userInfoData.uuid || ''
                this.transactionId = userInfoData.transactionId || ''
                
                console.log('已从本地存储加载用户信息:', this.userInfo)
                return true
            }
        } catch (error) {
            console.error('加载用户信息失败:', error)
        }
        return false
    }
    
    // 清除用户信息
    clearUserInfo() {
        try {
            this.token = ''
            this.refreshToken = ''
            this.accessExpiresAt = 0
            this.refreshExpiresAt = 0
            this.userInfo = null
            
            uni.removeStorageSync('userInfo')
            console.log('用户信息已清除')
        } catch (error) {
            console.error('清除用户信息失败:', error)
        }
    }
    
    // 刷新token
    async refreshTokens() {
        if (!this.refreshToken) {
            throw new Error('没有可用的刷新token')
        }
        
        try {
            console.log('开始刷新token')
            
            const systemInfo = uni.getSystemInfoSync()
            
            // 构建请求头
            const headers = {
                'Content-Type': 'application/json',
                'CLIENT-UDID': this.uuid,
                'CLIENT-PLATFORM': systemInfo.platform || 'unknown',
                'CLIENT-VERSION': '1.0.0',
                'ACCEPT-LANGUAGE': 'zh-CN',
                'Authorization': `Bearer ${this.token}` // 刷新token接口需要Bearer认证
            }
            
            // 构建请求体
            const requestBody = {
                refresh_token: this.refreshToken
            }
            
            console.log('刷新token请求参数:', { headers, requestBody })
            
            // 发送刷新token请求
            const response = await this.makeRequest('/v1/auth/refresh-token', {
                method: 'POST',
                headers: headers,
                data: requestBody
            })
            
            console.log('刷新token响应:', response)
            
            // 处理刷新token响应
            if (response.code === 200000 && response.data) {
                this.token = response.data.token
                this.refreshToken = response.data.refresh_token
                this.accessExpiresAt = response.data.access_expires_at
                this.refreshExpiresAt = response.data.refresh_expires_at
                
                // 保存更新后的用户信息到本地存储
                this.saveUserInfo()
                
                console.log('token刷新成功')
                return response.data
            } else {
                throw new Error(response.message || 'token刷新失败')
            }
            
        } catch (error) {
            console.error('刷新token失败:', error)
            // 如果刷新失败，清除用户信息并重新登录
            this.clearUserInfo()
            throw error
        }
    }
    
    // 获取用户状态（VIP等级），请求后端
    getUserStatus() {
        if (!this.isInit) {
            console.warn('User未初始化，请先调用init()方法')
            return
        }
        
        return this.userInfo
    }
    
    // 获取用户VIP信息
    getVipInfo() {
        if (!this.userInfo) {
            return { vip: 0, vipExpiredTime: 0 }
        }
        
        return {
            vip: this.userInfo.vip || 0,
            vipExpiredTime: this.userInfo.vip_expired_time || 0
        }
    }
    
    // 检查是否为VIP用户
    isVip() {
        const vipInfo = this.getVipInfo()
        return vipInfo.vip > 0 && vipInfo.vipExpiredTime > Date.now()
    }
}

// 创建并导出Login实例
const user = new User();
export { User, user };