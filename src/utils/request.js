import axios from 'axios'
import JSONBig from 'json-bigint'
// 引入vuex，用于判断用户是否登录系统
import store from '@/store'
// 导入路由
import router from '@/router/index.js'
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
// 配置请求拦截器
instance.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // config:对象  与 axios.defaults 相当
  // 借助config配置token
  // 判断token存在再做配置
  if (store.state.user.token) {
    // 注意：token前边有 'Bearer ' 的信息前缀
    config.headers.Authorization = 'Bearer ' + store.state.quser.token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 配置响应拦截器
instance.interceptors.response.use(function (response) {
  // 正常响应处理的
  // 升級處理
  // 有时返回的是data，有时是data.data
  // 过滤data
  try {
    return response.data.data
  } catch (err) {
    return response.data
  }
}, function (error) {
  // 非正常响应处理(包括401)
  // console.dir(error) // 对象： config request response isAxiosError toJSON
  if (error.response.status === 401) {
    // token不ok(token在服务器端已经失效了，2个小时时效)
    // 强制用户重新登录系统，以刷新服务器端的token时效
    router.push('/login')
    // 不要给做错误提示了
    return new Promise(function () { }) // 空的Promise对象，没有机会执行catch，进而不做错误提示了
  }
  // return new Promise((resolve,reject)=>{
  // reject('获得文章失败！')
  // })
  return Promise.reject(error)
})

// 导出动作
export default instance
