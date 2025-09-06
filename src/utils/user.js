import { baseComponent } from './base.js';

class User {
    constructor() {
        this.isInit = false
        this.channel = null
        this.uuid = ""
        this.transactionId = ""
        this.token = ""
    }

    init() {
        if (this.isInit) {
            return
        }

        if (!baseComponent.isInit) {
            baseComponent.init()
        }

        this.transactionId = baseComponent.transactionId
        this.uuid = this.getUUID()

        this.isInit = true

        this.token = this.login()
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
    login() {
        if (!this.isInit) {
            console.warn('User未初始化，请先调用init()方法')
            return
        }

        // 这里可以添加实际的登录逻辑
        console.log('执行登录逻辑')
        return
    }

    // 获取用户状态（VIP等级），请求后端
    getUserStatus() {
        if (!this.isInit) {
            console.warn('User未初始化，请先调用init()方法')
            return
        }
    }
}

// 创建并导出Login实例
const user = new User();
export { User, user };