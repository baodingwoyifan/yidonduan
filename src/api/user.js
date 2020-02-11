import request from '@/utils/request.js'

// login登录模块
// 导入axios模块
// 创建方法
// data传递进来的就是表单中的moble和code
export function apiUserLogin ({ mobile, code }) {
  // 请求axios request就是axios的复制品f
  // 返回执行结果，是一个promise对象
  // {mobile}代表手机号码
  // {code}代表验证码
  return request({
    url: 'app/v1_0/authorizations',
    method: 'POST',
    // data:,
    data: {
      // 对象成员简易成员赋值
      mobile,
      code
    }
  })
}
// 用户相关的请求函数
// import request from '@/utils/request' // 引入封装的模块
// export const login = ({ mobile, code }) => {
//   return request({
//     method: 'POST',
//     url: '/v1_0/authorizations',
//     data: {
//       mobile,
//       code
//     }
//   })
// }
// // 登录函数
// export function login (data) {
//   return request({
//     url: '/app/v1_0/authorizations',
//     data,
//     method: 'post'
//   }) //  得到一个promise对象  返回
// }
