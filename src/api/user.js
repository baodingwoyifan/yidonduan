import request from '@/utils/request.js'
// login登录模块
// 导入axios模块
// 创建方法
// data传递进来的就是表单中的moble和code
// { mobile, code }解构赋值
export function apiUserLogin ({ mobile, code }) {
  // 请求axios request就是axios的复制品f
  // 返回执行结果，是一个promise对象
  // {mobile}代表手机号码
  // {code}代表验证码
  return request({
    url: 'app/v1_0/authorizations',
    method: 'POST',
    data: {
      // 对象成员简易成员赋值
      mobile,
      code
    }
  })
}
/**
 * 关注作者
 * @param {target} 被关注用户id
 */
export function apiFollow(target) {
  return request({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      // 成员简易赋值
      target
    }
  })
}

/**
 * 取消关注作者
 * @param {target} 取消关注用户id
 */
export function apiUnFollow(target) {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${target}`
  })
}

/**获取用户自己的信息 */
export const apiUserInfo= () => {
  return request({
    // methhod默认是get，可以省略
    url:`/app/v1_0/user`,
    method:'GET'
  })
}
/**
 * 获取用户个人资料
 */
export function apiUserProfile() {
  return request({
    url: '/app/v1_0/user/profile', // 地址
    method: 'get'
  })
}

/**编辑用户头像api */
export function apiUserPhoto(FromdataObj){
  return request({
    url:'/app/v1_0/user/photo',
    method:'PATCH',
    data: FromdataObj
  })
}
/**编辑用户资料 */
export function apiSaveProfile({ name, gender, birthday}){
  return request({
    url:'/app/v1_0/user/profile',
    method:'PATCH',
    data:{
      name,
      gender,
      birthday
    }
  })
}