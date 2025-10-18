import { user } from './user.js';
import { MOCK_URL } from './config.js';

class Space {
    constructor() {
        this.apiBaseUrl = MOCK_URL;
    }

    /**
     * 获取用户作品列表
     * @param {Object} params - 查询参数
     * @param {number} params.page - 页码，默认为1
     * @param {number} params.per_page - 每页数量，默认为10
     * @returns {Promise<Object>} 返回作品列表数据
     */
    async getUserWorks(params = {}) {
        try {
            // 确保用户已初始化
            if (!user.isInit) {
                await user.init();
            }

            // 构建查询参数
            const queryParams = {
                page: params.page || 1,
                per_page: params.per_page || 10,
                ...params
            };
            
            // 手动构建查询字符串
            const queryString = Object.keys(queryParams)
                .filter(key => queryParams[key] !== undefined && queryParams[key] !== null)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
                .join('&');

            // 构建请求URL
            const url = `${this.apiBaseUrl}/user/works?${queryString}`;

            console.log('请求URL:', url);

            // 发送请求
            const response = await user.makeRequest(url, {
                method: 'GET'
            });

            return response;
        } catch (error) {
            console.error('获取用户作品失败:', error);
            throw error;
        }
    }

    /**
     * 获取用户作品的图片URL和提示词
     * @param {Object} params - 查询参数
     * @returns {Promise<Array>} 返回包含图片URL和提示词的数组
     */
    async getUserWorksWithImagesAndPrompts(params = {}) {
        try {
            const response = await this.getUserWorks(params);
            
            if (response.code !== 200000) {
                throw new Error(response.message || '获取作品失败');
            }

            // 提取图片URL和提示词
            const works = response.data.map(work => ({
                id: work.id,
                status: work.status,
                type: work.type,
                images: work.images || [],
                prompt: work.content?.prompt || '',
                created_at: work.created_at,
                updated_at: work.updated_at
            }));

            return {
                works,
                pager: response.pager
            };
        } catch (error) {
            console.error('获取用户作品图片和提示词失败:', error);
            throw error;
        }
    }

    /**
     * 获取指定状态的用户作品
     * @param {number} status - 作品状态 (0: 任务开始, 1: 任务进行, 2: 任务完成, -1: 任务失败, -2: 任务超时)
     * @param {Object} params - 其他查询参数
     * @returns {Promise<Object>} 返回指定状态的作品列表
     */
    async getUserWorksByStatus(status, params = {}) {
        return await this.getUserWorksWithImagesAndPrompts({
            ...params,
            status
        });
    }

    /**
     * 获取指定类型的用户作品
     * @param {number} type - 模型类型 (1: luma, 2: mj)
     * @param {Object} params - 其他查询参数
     * @returns {Promise<Object>} 返回指定类型的作品列表
     */
    async getUserWorksByType(type, params = {}) {
        return await this.getUserWorksWithImagesAndPrompts({
            ...params,
            type
        });
    }

    /**
     * 获取已完成的用户作品（状态为2）
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回已完成的作品列表
     */
    async getCompletedUserWorks(params = {}) {
        return await this.getUserWorksByStatus(2, params);
    }

    /**
     * 获取已完成作品的图片URL和提示词（仅状态为2的作品）
     * @param {Object} params - 查询参数
     * @returns {Promise<Array>} 返回包含图片URL和提示词的简化数组
     */
    async getCompletedWorksImagesAndPrompts(params = {}) {
        try {
            const response = await this.getUserWorks({
                ...params,
                status: 2  // 只获取状态为2（已完成）的作品
            });
            
            if (response.code !== 200000) {
                throw new Error(response.message || '获取已完成作品失败');
            }

            // 只返回图片URL和提示词的简化数据
            const completedWorks = response.data.map(work => ({
                id: work.id,
                images: work.images || [],
                prompt: work.content?.prompt || ''
            }));

            return {
                works: completedWorks,
                pager: response.pager
            };
        } catch (error) {
            console.error('获取已完成作品图片和提示词失败:', error);
            throw error;
        }
    }

    /**
     * 获取MJ模型的用户作品
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回MJ模型的作品列表
     */
    async getMJUserWorks(params = {}) {
        return await this.getUserWorksByType(2, params);
    }

    /**
     * 获取Luma模型的用户作品
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 返回Luma模型的作品列表
     */
    async getLumaUserWorks(params = {}) {
        return await this.getUserWorksByType(1, params);
    }
}

// 创建并导出Space单例实例
const space = new Space();
export { Space, space };