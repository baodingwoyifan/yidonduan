import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 过滤器
import * as filters from '@/utils/filters'
// 导入vant和懒加载模块
import Vant, { Lazyload }  from 'vant'
// 导入vantcss样式
import 'vant/lib/index.css'
// 导入自己的全局css样式，注意在vant的css样式后面引入
import './assets/css/global.less'
// rem基准值
import 'amfe-flexible/index.min.js'
// 对validate校验规则导入
import '@/utils/validate.js'
// 注册vant
Vue.use(Vant)
// 注册懒加载指令
Vue.use(Lazyload)
// 创建延迟器，名称为sleep，也可以自定义为其他名字
// Vue.prototype.$sleep = time => {
//   // 返回的是一个promise对象，可以使用async和await是异步变为同步
//   return new Promise((resolve) => {
//     window.setTimeout(() => {
//       // 规定在多久之后做一点事情，可以设置当前延迟器的等待时间
//       resolve()
//     }, time)
//   })
// }
Vue.prototype.$sleep = time => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}
Vue.config.productionTip = false
// 注册全局过滤器
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
