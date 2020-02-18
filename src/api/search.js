import request from '@/utils/request'

/**
 * 获得搜索页面联想建议数据{自动补全}
 * @param {联想的关键字} q
 */
export function apiSuggestionList({ q }) {
    return request({
        url: '/app/v1_0/suggestion',
        method: 'get',
        params: {
            q
        }
    })
}
/**
 * 根据联想关键字 搜索文章
 * @param {联想的关键字} q是关键字
 * @param {页码} page是默认页码
 * @param {返回内容条数} per_page是每页显示条数
 * 解构赋值可以设置默认值
 */
export function apiSearchList({ q, page = 1, per_page = 10 }) {
    return request({
        url: '/app/v1_0/search',
        method: 'get',
        params: {
            q,
            page,
            per_page
        }
    })
}
