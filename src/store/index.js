import Vue from 'vue'
import Vuex from 'vuex'

const USER_KEY = 'hm-toutiao-m-user-92'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // vuex通过localStorage获得用户token等信息
    user: JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
  },
  mutations: {
    updateUser (state, data) {
      // 更新vuex中用户token等信息
      state.user = data
      // 更新localStorage的用户token等信息
      window.localStorage.setItem(USER_KEY, JSON.stringify(data))
    },
    clearUser (state, user) {
      // 删除vuex中用户token等信息
      state.user = {}
      // 清除localStorage的用户token等信息
      localStorage.removeItem(USER_KEY)
    }
  },
  actions: {
  },
  modules: {
  }
})
