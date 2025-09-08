class Painter {
    constructor() {
        // this.baseUrl = "http://interstellar.a22t.com"
        this.baseUrl = "https://m1.apifoxmock.com/m1/7020404-0-default"
    }

    paint(prompt) {
        // 请求baseUrl+"/v1/task/imagine", body为prompt，method为post，获取返回中data.task_id
        return new Promise((resolve, reject) => {
            uni.request({
                url: this.baseUrl + "/v1/task/imagine",
                method: "POST",
                data: {
                    prompt: prompt
                },
                success: (res) => {
                    if (res.data.code === 200000) {
                        resolve(res.data.data.task_id);
                    } else {
                        reject(new Error(res.data.msg));
                    }
                },
                fail: (error) => {
                    reject(error);
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
                success: (res) => {
                    if (res.data.code === 200000) {
                        resolve(res.data.data);
                    } else {
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