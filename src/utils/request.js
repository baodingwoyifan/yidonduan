// 封装request模块
// 为什么要封装 ? 因为 要在拦截器里处理  token统一注入, 响应数据的统一处理返回 处理大数字
// token失效
import axios from 'axios' // 引入axios插件
import JSONBig from 'json-bigint' // 处理大数字插件
import store from '@/store' // 引入vuex中的store实例
import router from '@/router'
// 创建一个新的 插件实例
// 应该给request请求 一个默认的请求头  baseURL
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 设置一个常量的基础地址
  transformResponse: [function (data) {
    //  当后台 响应的字符串 回到axios请求时 就会触发
    //  data是一个字符串  把字符串转化成 对象并且返回 默认的是JSON.parse()
    // 如果data是一个空字符串  直接转化就会报错
    // return data ? JSONBig.parse(data) : {}
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data // 如果失败 就把字符串直接返回
    }
  }] // 处理后台返回的数据  字符串 => 对象  JSON.parse() => JSONBig.parse()  =>转化大数字类型
}) // 创建一个axios的请求 工具
// 拦截器
// 请求拦截器 => 发起请求 => 请求拦截器  => 服务器  => 统一注入token
// 响应拦截器 => 服务器  =>  响应拦截器   => then  await
instance.interceptors.request.use(function (config) {
  // 应该在返回配置之前  往配置里塞入token
  if (store.state.user.token) {
    //   如果token存在 就要注入
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 统一注入token
  }
  // 配置信息
  return config
}, function (error) {
  return Promise.reject(error) // 直接返回promise错误
})
// 响应拦截器
// instance.interceptors.response.use(function (response) {
//   // 响应数据  返回得到的响应数据  第一层data是axios默认包data, 第二个data是接口返回里面的包的data
//   try {
//     return response.data.data
//   } catch (error) {
//     return response.data
//   }
// }, function (error) {
//   // 错误的时候 token容易失效
//   return Promise.reject(error)
// })
// 响应拦截器 （响应成功：剥离无效数据，响应失败：刷新token）
instance.interceptors.response.use(res => {
  // 将来获取数据：res.data.data 麻烦
  // 我们想要结果：data 即可
  try {
    return res.data.data
  } catch (e) {
    return res
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

export default instance // 导出request工具
