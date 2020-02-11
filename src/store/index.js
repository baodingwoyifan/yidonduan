import Vue from 'vue'
import Vuex from 'vuex'
// 导入操作token的相关函数
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // vuex通过localStorage获得用户token等信息
    user: auth.getUser()
  },
  mutations: {
    updateUser (state, data) {
      // 更新vuex中用户token等信息
      state.user = data
      // 更新localStorage的用户token等信息
      auth.setUser(data)
    },
    clearUser (state, data) {
      // 删除vuex中用户token等信息
      state.user = {}
      // 清除localStorage的用户token等信息
      auth.setUser(data)
    }
  },
  actions: {
  },
  modules: {
  }
})
