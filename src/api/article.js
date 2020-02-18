// 文章 相关的请求函数
import request from '@/utils/request' // 引入封装的模块

// 根据频道获取文章列表，里面的参数是根据接口文档来的
// timestamp分页数据
export function apiArticleList({channel_id, timestamp}) {
    return request({
        url: '/app/v1_1/articles',
        method: 'get',
        params: {
            channel_id,
            timestamp,
            with_top:1
        }
    })
}
/**
 * 对不感兴趣(不喜欢)的文章做处理
 * @param {文章id} articleID
 */
export function apiArticleDislike(articleID) {
    return request({
        url: '/app/v1_0/article/dislikes',
        method: 'post',
        data: {
            target: articleID
        }
    })
}
/**
 * 对文章做举报处理
 * @param {文章id} articleID
 * @param {举报类型} type
 * 举报类型： 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，
 * 7-涉嫌违法犯罪，8-侵权'
 * {articleID, type, remark=''} 是对象解构赋值用法，这样可以清楚知道当前接口需要哪些参数，
 * 不用再查看接口文档了，非常方便
 */
export function apiArticleReport({ articleID, type, remark = '' }) {
    return request({
        url: '/app/v1_0/article/reports',
        method: 'post',
        data: {
            target: articleID,
            type,
            remark // 其他问题 的附加说明
        }
    })
}
/**
 * 根据id获得文章详情信息
 * @param {文章id} articleID
 */
export function apiArticleDetail(articleID) {
    return request({
        url: '/app/v1_0/articles/' + articleID,
        method: 'get'
    })
}
