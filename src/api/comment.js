// 评论 相关的请求函数
import request from '@/utils/request' // 引入封装的模块

/**
 * 获取指定文章的所有评论信息(接口：【获取评论或评论回复】)
 * @param {文章id} articleID
 * @param {评论id} commentID
 * type:'a'  表示获取文章评论
 * source：articleID   文章id，表示针对指定文章获得评论
 * offset:commentID  分页参数， 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
 * limit:10   每次返回10条评论信息
 * 注意：只有articleID 和 offset需要业务上做处理，type和limit是固定内容，不用处理
 */
export function apiCommentList({ articleID, commentID }) {
    return request({
        method: 'GET',
        url: '/app/v1_0/comments',
        params: {
            type: 'a',//type等于a ，获取的是评论信息
            source: articleID,//文章id
            offset: commentID,//分页标志
            limit: 10//每页显示条数
        }
    })
}
