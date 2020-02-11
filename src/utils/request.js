import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store' // 引入vuex中的store实例
import router from '@/router'
// 创建一个axios实例 和原来的axios没有关系
const instance = axios.create({
  // 构造参数
  baseURL: 'http://ttapi.research.itcast.cn/', // 设置请求地址常量
  transformResponse: [function (data) {
    //   data就是后端响应的字符串 默认的转化是 JSON.parse 处理大数字是有问题的额 需要用JSONBIG替换
    // return data ? JSONBig.parse(data) : {}
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
  }]
})
instance.interceptors.request.use(function (config) {
  // config就是请求的参数
  if (store.state.user.token) {
    //   统一注入token
    config.headers.Authorization = 'Bearer ' + store.state.user.token
  }
  return config
}, function (error) {
  // 返回失败
  return Promise.reject(error)
})
// 响应拦截器
// 响应拦截器 （响应成功：剥离无效数据，响应失败：刷新token）
instance.interceptors.response.use(res => {
  // 将来获取数据：res.data.data 麻烦
  // 我们想要结果：data 即可
  try {
    return res.data.data
  } catch (e) {
    return res.data
  }
}, async err => {
  try {
    // 目的：刷新token
    if (err.response && err.response.status === 401) {
      // 未登录  跳转登录页面  阻止程序运行
      const { user } = store.state
      // 如果没有token没登录  如果没有refresh_token无法刷新token
      if (!user.token || !user.refresh_token) {
        router.push('/login')
        return Promise.reject(err)
      }
      // 刷新token 发请求  没有配置的axios  自己配置refresh_token
      const res = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // token获取  res.data.data.token
      // 更新 vuex 和 本地 token
      store.commit('setUser', {
        token: res.data.data.token,
        refresh_token: user.refresh_token
      })
      // 继续发送刚才错误的请求
      // instance({之前错误的请求配置})
      // err错误对象 包含（response 响应对象 |config 请求配置）
      return instance(err.config)
    }
  } catch (e) { // exception 异常
    // 刷新token失败
    router.push('/login')
    return Promise.reject(e)
  }
  return Promise.reject(err)
})

export default instance
