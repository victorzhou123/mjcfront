import { baseComponent } from './base.js';

class IAPManager {
    constructor() {
        this.channel = null;
        this.isInit = false;
        this.initError = null;
        this.products = [];
        this.baseUrl = "http://interstellar.a22t.com"
    }

    async init() {
        if (this.isInit) {
            return;
        }

        if (!baseComponent.isInit) {
            await baseComponent.init()
        }

        this.channel = baseComponent.channel

        // 从服务器获取商品列表
        if (!this.products.length) {
            await this.getProductsFromServer();
        }

        this.isInit = true;

        console.log('IAP初始化完成');
    }

    async getProductsFromServer() {
        console.log('开始从服务器获取商品列表');
        try {
            const response = await uni.request({
                url: `${this.baseUrl}/v1/products`,
                method: 'GET',
                header: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`,
                    'CLIENT-UDID': uni.getStorageSync('udid') || '',
                    'CLIENT-PLATFORM': uni.getSystemInfoSync().platform,
                    'CLIENT-VERSION': '1.0.0',
                    'ACCEPT-LANGUAGE': 'zh-CN'
                }
            });

            if (response.data && response.data.code === 200000) {
                this.products = response.data.data.subscriptions;
                console.log('获取到的商品列表:', this.products);
                return this.products;
            } else {
                throw new Error(response.data?.message || '获取商品列表失败');
            }
        } catch (error) {
            console.error('获取商品列表失败:', error);
            throw error;
        }
    }

    async purchaseProduct(productId) {
        try {
        console.log('开始购买产品:', productId);
        
        if (!this.isInit) {
            throw new Error('IAP未初始化');
        }
        
        // 查找产品信息
        const product = this.products.find(p => p.product_id === productId);
        if (!product) {
            throw new Error(`未找到产品: ${productId}`);
        }

        // 向后端校验
        const res = await this.serverCheckPurchase(productId);
        if (!res.success) {
            throw new Error('后端校验失败');
        }
        
        return new Promise((resolve, reject) => {
            uni.requestPayment({
            provider: 'appleiap',
            orderInfo: {
                productid: productId
            },
            success: async (result) => {
                console.log('购买成功:', result);
                try {
                    await this.handlePurchaseSuccess(result, product);
                    resolve(result);
                } catch (error) {
                    console.error('处理购买成功回调失败:', error);
                    reject(error);
                }
            },
            fail: async (error) => {
                console.error('购买失败:', error);
                try {
                    await this.handlePurchaseError(error, productId);
                } catch (handleError) {
                    console.error('处理购买失败回调失败:', handleError);
                }
                reject(error);
            }
            });
        });
        } catch (error) {
        console.error('购买产品失败:', error);
        throw error;
        }
    }

    /**
    * 处理购买成功
    */
    async handlePurchaseSuccess(result, product) {
        try {
        console.log('处理购买成功:', result, product);
        
        // 验证收据
        const verifyResult = await this.verifyReceipt(result);
        if (!verifyResult.success) {
            throw new Error('收据验证失败');
        }
        
        console.log(`购买成功，订阅了${product.title}`);
        
        return {
            success: true,
            title: product.title,
            result: result
        };
        } catch (error) {
        console.error('处理handlePurchaseSuccess失败:', error);
        throw error;
        }
    }

    /**
     * 处理购买错误
     */
    async handlePurchaseError(error, productId) {
        console.error('购买失败:', error, productId);
        
        // 这里可以添加错误统计或用户提示逻辑
        return {
        success: false,
        error: error,
        productId: productId
        };
    }

    /**
     * 验证收据
     */
    async verifyReceipt(result) {
        try {
        console.log('开始验证收据:', result);
        
        // 这里应该调用服务器验证收据，请求后端接口
        // 目前先返回成功，实际项目中需要实现服务器验证
        const verifyResult = await this.serverVerifyReceipt(result.receipt);
        
        return {
            success: true,
            result: verifyResult
        };
        } catch (error) {
        console.error('验证收据失败:', error);
        return {
            success: false,
            error: error
        };
        }
    }

    /**
     * 后端校验购买
     */
    async serverCheckPurchase(productId) {
        console.log('开始后端校验购买:', productId);
        try {
            const response = await uni.request({
                url: '/v1/purchase/verify',
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${uni.getStorageSync('token')}`,
                    'CLIENT-UDID': uni.getStorageSync('udid') || '',
                    'CLIENT-PLATFORM': uni.getSystemInfoSync().platform,
                    'CLIENT-VERSION': '1.0.0',
                    'ACCEPT-LANGUAGE': 'zh-CN',
                    'Content-Type': 'application/json'
                },
                data: {
                    product_id: productId
                }
            });

            if (response.data && response.data.code === 200000) {
                console.log('后端校验成功:', response.data);
                return { success: true, data: response.data.data };
            } else {
                console.error('后端校验失败:', response.data);
                return { success: false, message: response.data?.message || '校验失败' };
            }
        } catch (error) {
            console.error('后端校验请求失败:', error);
            return { success: false, message: '网络请求失败' };
        }
    }

    /**
     * 服务器验证收据
     */
    async serverVerifyReceipt(receipt) {
        // TODO: 实现服务器收据验证，给后端传送receipt.transactionIdentifier
        console.log('服务器验证收据:', receipt);
        return {
            success: true,
            receipt: receipt
        };
    }

    /**
     * 恢复购买
     */
    async restoreTransactions() {
        try {
            console.log('开始恢复购买');
        
            // 调用恢复购买接口
            this.channel.restoreCompletedTransactions({}, function(restoreResult) {
                uni.hideLoading();
                console.log('恢复购买结果:', restoreResult);

                if (restoreResult && restoreResult.length > 0) {
                    // 遍历恢复的交易信息，通常需要将这些交易凭证发送到你的服务器进行验证
                    restoreResult.forEach(transaction => {
                        if (transaction.transactionState === '1') { // 假设 '1' 代表购买成功状态
                            console.log('找到可恢复交易:', transaction);
                            // 将 transaction.transactionReceipt 发送到你的服务器进行验证并解锁内容
                            this.serverVerifyReceipt(transaction.transactionReceipt).then(res => {
                                if (res.success) {
                                    uni.showToast({ title: '购买成功', icon: 'success' });
                                } else {
                                    uni.showToast({ title: '购买失败', icon: 'none' });
                                }
                            }).catch(err => {
                                console.error('服务器验证失败:', err);
                            });
                        }
                    });
                    uni.showToast({ title: `已恢复${restoreResult.length}项购买`, icon: 'success' });
                } else {
                    uni.showToast({ title: '没有可恢复的购买项目', icon: 'none' });
                }
            }, function(error) {
                    uni.hideLoading();
                    console.error('恢复购买请求失败:', error);
                    uni.showModal({
                    title: '恢复失败',
                    content: error.message || '请检查网络并重试',
                    showCancel: false
                });
            });

            return {
                success: true,
                transactions: []
            };
        } catch (error) {
        console.error('恢复购买失败:', error);
        throw error;
        }
    }

    /**
     * 获取初始化状态
     */
    getInitStatus() {
        return {
        isInitialized: this.isInitialized,
        hasError: !!this.initError,
        error: this.initError
        };
    }

    /**
     * 清理资源
     */
    cleanup() {
        this.iapChannel = null;
        this.products = [];
        this.initError = null;
        this.isInitialized = false;
        this.supportedProviders = [];
    }
}



// 创建并导出IAPManager实例
const iapManager = new IAPManager();
export { iapManager };