import { baseComponent } from './base.js';
import { BASE_URL, MOCK_URL, USER_TOKEN, USER_REFRESH_TOKEN, USER_ACCESS_EXPIRES_AT, USER_REFRESH_EXPIRES_AT, USER_ID , USER_UUID, USER_VIP, USER_VIP_EXPIRED_TIME, USER_TRANSACTION_ID} from './config.js';

class User {
    constructor() {
        this.isInit = false
        this.channel = null
        this.apiBaseUrl = BASE_URL; // 请根据实际API地址修改
        this.mockUrl = MOCK_URL
    }

    async init() {
        if (this.isInit) {
            return
        }

        console.log('user init begin...')

        if (!baseComponent.isInit) {
            await baseComponent.init()
        }

        await this.setUUID()

        console.log('uuid in user:', uni.getStorageSync(USER_UUID))

        this.isInit = true

        await this.login()
    }

    async setUUID() {
        uni.setStorageSync(USER_TRANSACTION_ID, uni.getStorageSync(USER_TRANSACTION_ID))
        uni.setStorageSync(USER_UUID, this.getUUID())
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

    async userHeader() {
        return {
            'Content-Type': 'application/json',
            'CLIENT-UDID': uni.getStorageSync(USER_UUID),
            'CLIENT-PLATFORM': uni.getSystemInfoSync().platform || 'unknown',
            'CLIENT-VERSION': '1.0.0', // 可以从manifest.json或其他地方获取
            'ACCEPT-LANGUAGE': 'zh-CN',
            'Authorization': `Bearer ${uni.getStorageSync(USER_TOKEN)}` // 刷新token接口需要Bearer认证
        }
    }

    // 登录，请求后端
    async login() {
        if (!this.isInit) {
            console.warn('User未初始化，请先调用init()方法')
            return
        }

        if (!uni.getStorageSync(USER_UUID)) {
            throw new Error('缺少必要的登录参数: uuid')
        }

        try {
            console.log('开始执行登录请求')

            const uuid = uni.getStorageSync(USER_UUID)
            const transactionId = uni.getStorageSync(USER_TRANSACTION_ID)
            
            // 构建请求头
            const headers = await this.userHeader()
            
            // 构建请求体
            const requestBody = {
                udid: uuid,
            }
            
            // 如果transactionId存在，则添加到请求体中
            if (transactionId) {
                requestBody.origin_transaction_id = transactionId
            }
            
            console.log('登录请求参数:', { headers, requestBody })
            
            // 发送登录请求
            const response = await this.makeRequest(`${this.apiBaseUrl}/v1/auth/login`, {
                method: 'POST',
                headers: headers,
                data: requestBody
            })
            
            console.log('登录响应:', response)
            
            // 处理登录响应
            if (response.code === 200000 && response.data) {
                // 保存登录用户信息
                this.saveLoginUserInfo(response.data)
                this.getUserInfo()
                
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

    saveLoginUserInfo(userInfo) {
        console.log('saveLoginUserInfo:', userInfo)
        uni.setStorageSync(USER_TOKEN, userInfo.token)
        uni.setStorageSync(USER_REFRESH_TOKEN, userInfo.refresh_token)
        uni.setStorageSync(USER_ACCESS_EXPIRES_AT, userInfo.access_expires_at)
        uni.setStorageSync(USER_REFRESH_EXPIRES_AT, userInfo.refresh_expires_at)
    }

    // 发送HTTP请求的通用方法
    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                url: url,
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

    // 发送HTTP请求的通用方法
    async makeRequestMock(url, options = {}) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                url: this.mockUrl + url,
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
            const response = await this.makeRequest(`${this.apiBaseUrl}/v1/auth/refresh-token`, {
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
    async getUserInfo() {
        const header = await this.userHeader()

        // 如果userInfo为空，则请求获取用户信息
        if (!uni.getStorageSync(USER_VIP)) {
            try {
                console.log('用户信息为空，正在请求获取用户状态...')
                
                const response = await this.makeRequestMock(`/v1/user`, {
                    method: 'GET',
                    header: header,
                })

                console.log('获取用户信息响应:', response)
                
                if (response.data) {
                    this.saveUserInfo(response.data) // 保存到本地存储
                } else {
                    console.error('获取用户状态失败:', response.data?.message || '未知错误')
                }
            } catch (error) {
                console.error('请求用户状态失败:', error)
            }
        }
    }

    saveUserInfo(userinfo) {
        uni.setStorageSync(USER_ID, userinfo.id)
        uni.setStorageSync(USER_UUID, userinfo.uuid)
        uni.setStorageSync(USER_VIP, userinfo.vip)
        uni.setStorageSync(USER_VIP_EXPIRED_TIME, userinfo.vip_expired_time)
    }
    
    // 获取用户VIP信息
    async getVipInfo() {
        if (!uni.getStorageSync(USER_VIP)) {
            await this.getUserInfo()
        }
        
        return {
            vip: uni.getStorageSync(USER_VIP) || 0,
            vipExpiredTime: uni.getStorageSync(USER_VIP_EXPIRED_TIME) || 0
        }
    }
    
    // 检查是否为VIP用户
    async isVip() {
        const vipInfo = await this.getVipInfo()
        
        return vipInfo.vip > 0 && vipInfo.vipExpiredTime > Date.now()
    }
}

// 创建并导出Login实例
const user = new User();
export { User, user };