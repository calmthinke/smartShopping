import Vue from 'vue'
import Vuex from 'vuex'
// 导入模块
import user from '@/store/modules/user'
import cart from '@/store/modules/cart'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
    token (state) {
      return state.user.userInfo.token
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    cart
  }
})
