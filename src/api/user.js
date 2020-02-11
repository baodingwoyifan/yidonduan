// login登录模块
// 导入axios模块

import request from '@/utils/request.js'
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
