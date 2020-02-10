// 用户相关的请求函数
import request from '@/utils/request' // 引入封装的模块

// 登录函数
export function login (data) {
  return request({
    url: '/app/v1_0/authorizations',
    data,
    method: 'post'
  }) //  得到一个promise对象  返回
}
