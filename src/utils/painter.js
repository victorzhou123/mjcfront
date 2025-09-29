import { BASE_URL, USER_TOKEN } from './config.js';


class Painter {
    constructor() {
        this.baseUrl = BASE_URL
    }

    paint(prompt) {
        // 请求baseUrl+"/v1/task/imagine", body为prompt，method为post，获取返回中data.task_id
        return new Promise((resolve, reject) => {
            uni.request({
                url: this.baseUrl + "/v1/task/imagine",
                method: "POST",
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${uni.getStorageSync(USER_TOKEN)}`
                },
                data: {
                    prompt: prompt
                },
                success: (res) => {
                    if (res.data.code === 200000) {
                        // 返回统一格式的成功响应
                        resolve({
                            success: true,
                            msg: '图片生成任务创建成功',
                            data: {
                                task_id: res.data.data.task_id
                            }
                        });
                    } else {
                        console.error('图片生成请求失败:', res.data.msg, '错误码:', res.data.code);
                        // 返回统一格式的失败响应
                        resolve({
                            success: false,
                            msg: res.data.msg || '图片生成请求失败',
                            data: null
                        });
                    }
                },
                fail: (error) => {
                    console.error('网络请求失败:', error);
                    // 返回统一格式的网络错误响应
                    resolve({
                        success: false,
                        msg: '请求失败，未知错误',
                        data: null
                    });
                }
            })
        })
    }

    pollTaskStatus(taskId) {
        // 请求baseUrl+"/v1/tasks/{id}"，method为get，获取返回中response body
        // body为
        // {
        //     "message": "操作成功！",
        //     "data": {
        //         "id": 5,
        //         "status": 2,
        //         "type": 1,
        //         "images": [
        //             "https://test-mj-video.oss-cn-beijing.aliyuncs.com/gfast/dcmkryvlbhiyyybaei.png",
        //             "https://test-mj-video.oss-cn-beijing.aliyuncs.com/gfast/dcmks0daeos89bpm2n.png",
        //             "https://test-mj-video.oss-cn-beijing.aliyuncs.com/gfast/dcmks262w5xa6wr6si.png",
        //             "https://test-mj-video.oss-cn-beijing.aliyuncs.com/gfast/dcmks4b2r5wwsua4zh.png"
        //         ],
        //         "content": {
        //             "prompt": "一个美女在河边"
        //         }
        //     },
        //     "code": 200000
        // }
        return new Promise((resolve, reject) => {
            uni.request({
                url: this.baseUrl + "/v1/tasks/" + taskId,
                method: "GET",
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${uni.getStorageSync(USER_TOKEN)}`
                },
                success: (res) => {
                    if (res.data.code === 200000) {
                        resolve(res.data.data);
                    } else {
                        console.error('任务状态查询失败:', res.data.msg, '错误码:', res.data.code);
                        reject(new Error(res.data.msg));
                    }
                },
                fail: (error) => {
                    reject(error);
                }
            })
        })
    }
}

// 创建并导出painter实例
const painter = new Painter()
export { painter }