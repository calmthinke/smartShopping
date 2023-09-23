import { setInfo, getInfo } from '@/utils/storage'
export default {
  // 开启命名空间,使模块独立
  namespaced: true,
  // 提供数据
  state () {
    return {
      // 个人权证相关信息
      userInfo: getInfo()
    }
  },
  // 提供修改数据的方法
  mutations: {
    // 所有mutation的第一个参数都是state
    // 个人权证信息

    // 1. 存储个人信息
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }

  },
  // 提供异步方法
  actions: {
    logout (context) {
      // 个人信息重置
      context.commit('setUserInfo', {})
      // 购物车重置
      // 问题:跨模块 调用mutation
      context.commit(
        'cart/setCartList',
        [],
        {
          root: true
        }
      )
    }
  },
  // 提供属性
  getters: {}

}
