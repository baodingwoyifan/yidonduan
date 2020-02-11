import axios from 'axios'
import JSONBig from 'json-bigint'
// 引入vuex，用于判断用户是否登录系统
import store from '@/store'
// 创建一个新的axios实例 和原来的axios没有关系
// 给instance配置公共请求跟地址、请求、响应拦截器、401处理、大整形数字处理
// 所有的配置都是给instance配置的
// 为什么不直接对axios配置？
// 在别的地方可能还要使用原生axios的
// instance的出现，可以保证axios是纯净的
const instance = axios.create({
  // 请求根地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 配置数据转换器
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    // if (data) {
    //   return JSONBig.parse(data) // 只针对大整型数据进行处理，其他的不处理
    // } else {
    //   return data
    // };
    // 下面代码是对上面的if的升级处理
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }],
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
})
// 配置情求拦截器
instance.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // config:对象  与 axios.defaults 相当
  // 借助config配置token
  // 判断token存在再做配置
  if (store.state.user.token) {
    // 注意：token前边有 'Bearer ' 的信息前缀
    config.headers.Authorization = 'Bearer ' + store.state.user.token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 导出动作
export default instance
