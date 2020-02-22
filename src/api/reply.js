// 回复 相关的请求函数
import request from '@/utils/request' // 引入封装的模块

/**
 * 获取指定“评论”的所有回复信息(接口：【获取评论或评论回复】)
 * @param {评论id} commentID
 * @param {回复id} replyID
 * type:'c'  获取评论的回复信息
 * source：commentID   文章id，表示针对指定文章获得评论
 * offset: replyID  分页参数， 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，
 * 								不传表示从第一页开始读取数据
 * limit:10   每次返回10条评论信息
 * 注意：只有articleID 和 offset需要业务上做处理，type和limit是固定内容，不用处理
 */
export function apiReplyList({ commentID, replyID }) {
    return request({
        method: 'GET',
        url: '/app/v1_0/comments',
        params: {
            type: 'c',
            source: commentID,
            offset: replyID,
            limit: 10
        }
    })
}

/**
 * 添加评论或回复信息 (接口：【添加评论或评论回复】)
 * @param {*} target	文章或评论的id（评论文章即为 文章id，对评论进行回复则为 评论id）
 * @param {*} content	评论或回复的内容
 * @param {*} art_id	文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。
 *                    对文章进行评论，不要传此参数
 */
export function apiAddCorR({ target, content, art_id = null }) {
    return request({
        method: 'POST',
        url: '/app/v1_0/comments',
        data: {
            target,//文章id、评论id
            content,//内容
            art_id//文章id，添加回复的时候需要传递
        }
    })
}