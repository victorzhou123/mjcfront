import { baseComponent } from './base.js';
import { USER_TOKEN } from './config.js';
import { BASE_URL, MOCK_URL } from './config.js';

class IAPManager {
    constructor() {
        this.channel = null;
        this.isInit = false;
        this.initError = null;
        this.products = [];
        this.baseUrl = BASE_URL;
        this.mockUrl = MOCK_URL;
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
                    'Authorization': `Bearer ${uni.getStorageSync(USER_TOKEN)}`,
                    'CLIENT-UDID': uni.getStorageSync(USER_UUID) || '',
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

    async checkProduct(productId) {
        try {
            console.log('开始商品信息和用户资格:', productId)

            // 查找产品信息
            const product = this.products.find(p => p.product_id === productId);
            if (!product) {
                throw new Error(`未找到产品: ${productId}`);
            }

            // 前端直接向apple服务器进行产品信息校验
            await this.getProducts([productId]);

            // 向后端校验产品信息
            const res = await this.serverCheckPurchase(productId, user.transactionId);
            if (!res.success) {
                throw new Error('后端校验失败');
            }
            
            // 如果需要确认，返回确认信息给调用方处理
            if (res.data && res.data.needConfirm) {
                return {
                    needConfirm: true,
                    tips: res.data.tips,
                    productId: productId
                };
            }
            
            // 检测通过
            return {
                needConfirm: false,
                productId: productId
            };
        } catch (error) {
            console.error('检查产品失败:', error);
            throw error;
        }
    }

    async getProducts(productIds) {
        console.log('开始获取iap商品列表');
        return new Promise((resolve, reject) => {
        this.channel.requestProduct(productIds, (res) => {
            // 打印商品列表
            console.log('获取到的商品列表:', res);
            resolve(res);
        }, (err) => {
            // 打印错误信息
            console.error('获取商品列表失败:', err);
            reject(err);
        })
        });
    }

    async purchaseProduct(productId) {
        try {
            console.log('开始购买产品:', productId);
            
            if (!this.isInit) {
                throw new Error('IAP未初始化');
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
                        await this.handlePurchaseSuccess(result);
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
//    result example
//    {
//     "payment": {
//         "productid": "mjc.vip.week",
//         "quantity": "1",
//         "username": "(null)"
//     },
//     "transactionDate": "2025-09-25 08:41:43",
//     "transactionIdentifier": "2000001020353154",
//     "transactionReceipt": "xxxxx"
//     "transactionState": "1",
//     "errMsg": "requestPayment:ok"
//     }
    async handlePurchaseSuccess(result) {
        try {
            console.log('处理购买成功:', result);
            
            // 验证收据，失败时重试2次
            let verifyResult;
            let retryCount = 0;
            const maxRetries = 2;
            
            do {
                verifyResult = await this.subscribeDelivery(result);
                if (verifyResult.success) {
                    break;
                }
                
                retryCount++;
                if (retryCount <= maxRetries) {
                    console.log(`收据验证失败，正在进行第${retryCount}次重试...`);
                    // 等待0.5秒后重试
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } while (retryCount <= maxRetries);
            
            if (!verifyResult.success) {
                throw new Error(`收据验证失败，已重试${maxRetries}次`);
            }
            
            console.log(`购买成功！`);
            
            return {
                success: true,
                title: result.payment.productid,
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
     * 处理购买成功，订阅交付
     */
    async subscribeDelivery(result) {
        try {
            console.log('开始验证收据:', result);
            
            // 向后端请求订阅交付接口
            const response = await uni.request({
                url: `${this.mockUrl}/v1/subscriptions/deliver`,
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${user.token}`,
                    'CLIENT-UDID': user.uuid || '',
                    'CLIENT-PLATFORM': uni.getSystemInfoSync().platform,
                    'CLIENT-VERSION': '1.0.0',
                    'ACCEPT-LANGUAGE': 'zh-CN',
                    'Content-Type': 'application/json'
                },
                data: {
                    transaction_id: result.transactionId
                }
            });
            
            console.log('订阅交付响应:', response);
            
            // 检查响应状态
            if (response.data) {
                const isDelivered = response.data.data.is_deliver;
                console.log('订阅交付结果:', isDelivered);
                
                return {
                    success: true,
                    isDelivered: isDelivered,
                    result: response.data
                };
            } else {
                console.error('订阅交付失败:', response.data.message || '未知错误');
                return {
                    success: false,
                    error: response.data.message || '订阅交付失败'
                };
            }
        } catch (error) {
            console.error('处理订阅交付失败:', error);
            return {
                success: false,
                error: error
            };
        }
    }

    /**
     * 后端校验购买 - 订阅验证
     * @param {string} productId - 产品ID
     * @param {string} transactionId - 随意一个订单ID
     */
    async serverCheckPurchase(productId, transactionId) {
        console.log('开始后端校验购买:', productId, transactionId);
        try {
            // 根据productId获取订阅ID
            const subscriptionId = this.getSubscriptionIdByProductId(productId);
            if (!subscriptionId) {
                console.error('未找到对应的订阅ID:', productId);
                return { success: false, message: '未找到对应的订阅产品' };
            }

            const response = await uni.request({
                url: `${this.mockUrl}/v1/subscriptions/${subscriptionId}`,
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${uni.getStorageSync(USER_TOKEN)}`,
                    'CLIENT-UDID': uni.getStorageSync(USER_UUID) || '',
                    'CLIENT-PLATFORM': uni.getSystemInfoSync().platform,
                    'CLIENT-VERSION': '1.0.0',
                    'ACCEPT-LANGUAGE': 'zh-CN',
                    'Content-Type': 'application/json'
                },
                data: {
                    transaction_id: transactionId
                }
            });

            console.log('后端校验购买响应:', response);

            if (response.statusCode === 200) {
                console.log('后端校验成功:', response.data);
                const { is_check_passed, need_confirm, tips } = response.data.data;
                return { 
                    success: true, 
                    data: {
                        isCheckPassed: is_check_passed,
                        needConfirm: need_confirm,
                        tips: tips
                    }
                };
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
     * 根据产品ID获取订阅ID
     * @param {string} productId - 产品ID
     * @returns {number|null} - 订阅ID
     */
    getSubscriptionIdByProductId(productId) {
        if (!this.products || this.products.length === 0) {
            console.warn('产品列表为空，无法获取订阅ID');
            return null;
        }

        const product = this.products.find(p => p.product_id === productId);
        return product ? product.id : null;
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