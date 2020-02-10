import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant
import Vant from 'vant'
// 导入vantcss样式
import 'vant/lib/index.css'
// 导入自己的全局css样式，注意在vant的css样式后面引入
import './assets/css/global.less'
// rem基准值
import 'amfe-flexible/index.min.js'
// 注册vant
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
