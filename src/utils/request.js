import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store' // 引入vuex中的store实例
import router from '@/router'
// 创建一个axios实例 和原来的axios没有关系
const instance = axios.create({
  // 构造参数
  //【配置情求跟地址
  baseURL: 'http://ttapi.research.itcast.cn/', 
  transformResponse: [function (data) {
    //   data就是后端响应的字符串 默认的转化是 JSON.parse 处理大数字是有问题的额 需要用JSONBIG替换
    // return data ? JSONBig.parse(data) : {}
    //数据转换器
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

// 响应拦截器 （响应成功：剥离无效数据，响应失败：刷新token）
// 响应拦截器
instance.interceptors.response.use(function (response) {
  //  得到的response实际上被axios包 一层数据
  try {
    //  将数据解构
    return response.data.data
  } catch (error) {
    return response.data
  }
}, async function (error) {
  // 响应有错误，有可能错误状态码为401
  if (error.response.status === 401) {
    // 如果refresh_token不存在
    if (!store.state.user.refresh_token) {
      router.push('/login')
      return Promise.reject(error)
    }

    try {
      // 创建一个新的axios
      // 刷新用户token
      // 应该发送一个请求 换取新的token
      // 这里不应该再用instance  因为 instance会再次进入拦截器  用默认的axios
      const result = await axios({
        method: 'put',
        //刷新用户token
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        // 配置token
        headers: {
          Authorization: `Bearer ${store.state.user.refresh_token}`
        }
      })
      // 获取到新token后，就对vuex和localStorage进行更新
      // 注意：axios通过refresh_token向服务器端发送请求，返回的数据信息中只有token，
      //      没有refresh_token
      store.commit('updateUser', {
        token: result.data.data.token, // 拿到新的token之后
        refresh_token: store.state.user.refresh_token // 将之前 refresh_token 获取使用
      })
      // error.config对象中存有之前失败请求的所有参数信息
      // 例如url、method、data等等
      return instance(error.config) // 把刚才错误的请求再次发送出去 然后将promise返回
    } catch (err) {
      // 如果错误 表示补救措施也没用了(有可能refresh_token也失效了)
      // 应该跳转到登录页 并且 把废掉的用户信息全都干掉
      store.commit('clearUser') // 所有的用户信息清空
      router.push('/login') // 跳转到回登录页
      return Promise.reject(err)
    }
  }
  return Promise.reject(error)
})
export default instance
