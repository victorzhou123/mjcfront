import { USER_TRANSACTION_ID } from './config.js'

class BaseComponent {
    constructor() {
        this.isInit = false
        this.channel = null
    }

    async init() {
        if (this.isInit) {
            return
        }

        await this.getChannel()

        await this.getTransactionId()
    }

    async getChannel() {
        console.log('开始获取IAP支付通道');
        
        if (this.channel !== null) {
            this.isInit = true;
            return Promise.resolve(this.channel);
        }

        return new Promise((resolve, reject) => {
            try {
                uni.getProvider({
                    service: 'payment',
                    success: (res) => {
                        this.channel = res.providers.find((channel) => {
                            return (channel.id === 'appleiap');
                        });

                        if (this.channel) {
                            this.isInit = true;
                            resolve(this.channel);
                        } else {
                            this.channel = null;
                            reject(new Error('未找到Apple IAP支付通道'));
                        }
                    },
                    fail: (error) => {
                        console.log('获取IAP支付通道失败:', error);
                        this.channel = null;
                        this.isInit = false;
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async getTransactionId() {
        console.log('开始获取transactionId');
        const transactionId = uni.getStorageSync(USER_TRANSACTION_ID)

        if (transactionId != "") {
            return transactionId;
        }

        console.log('开始获取完成了但是没关闭的订单');
        try {
            // 请求完成了但是没关闭的订单
            await new Promise((resolve, reject) => {
                this.channel.restoreCompletedTransactions({}, (restoreResult) => {
                    console.log('restoreResult:', restoreResult);

                    if (transactionId == "" && restoreResult && restoreResult.length > 0) {
                        // 遍历restoreResult，找到一个object，obejct.payment.productid里含有vip字符且obejct.transactionState==1的
                        restoreResult.forEach(transaction => {
                            console.log('transaction:', transaction);
                            if (transaction.payment.productId.indexOf("vip") !== -1) {
                                transactionId = transaction.transactionId
                                uni.setStorageSync(USER_TRANSACTION_ID, transactionId);
                            }
                        });
                        resolve(transactionId);
                    }

                    resolve(uni.getStorageSync(USER_TRANSACTION_ID));
                }, (error) => {
                    console.error('恢复购买请求失败:', error);
                    reject(error);
                });
            });
        } catch (error) {
            console.error('恢复购买失败:', error);
            throw error;
        }
    }
}

// 创建并导出BaseComponent单例实例
const baseComponent = new BaseComponent();
export { BaseComponent, baseComponent };

