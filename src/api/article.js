// 文章 相关的请求函数
import request from '@/utils/request' // 引入封装的模块

// 根据频道获取文章列表
export function apiArticleList(channel_id, timestamp, with_top) {
    return request({
        url: '/app/v1_1/articles',
        method: 'get',
        params: {
            channel_id,
            timestamp,
            with_top
        }
    })
}
