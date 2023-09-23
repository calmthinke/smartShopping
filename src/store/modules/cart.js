import { changeCount, getCartList, delSelect } from '@/api/cart'
export default {
  namespaced: true,
  state () {
    return {
      cartList: []// 存放商品列表
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList
    },
    // 提供改变复选框状态的方法
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    // 提供改变全选框的方法
    toggleAllCheck (state, flag) {
      // 让所有的小选框同步设置
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    // 提供修改本地数量的方法
    changeMycount (state, { goodsId, goodsNum }) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    // 异步得获取购物车数据的方法
    async getCartAction (context) {
      const { data } = await getCartList()
      console.log(data)
      // 后台数据中没有复选框的选中状态,为了实现将来的功能
      // 需要手动维护数据,给每一项添加一个isChecked状态(标记当前商品是否选中)
      data.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', data.list)
    },
    // 异步请求更改购物车数据的方法
    async changeCountAction (context, obj) {
      const { goodsId, goodsNum, goodsSkuId } = obj
      // 本地修改(后台修改后要刷新才能看见修改后的结果,所有先本地修改)
      context.commit('changeMycount', { goodsId, goodsNum })
      // 后台修改数据
      await changeCount(goodsId, goodsNum, goodsSkuId)
    },
    // 删除购物车数据的请求
    async delSelect (context) {
      const cartids = context.getters.selCartList.map(item => item.id)
      await delSelect(cartids)
      // 重新渲染页面(在action 里面调取其他action)
      context.dispatch('getCartAction')
    }

  },
  getters: {
    // 求所有商品累加总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 问题:
    // 在getters中访问其他getters(看官方文档)
    // 选中的总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的总价
    selPrice (state, getters) {
      return getters.selCartList.reduce(
        (sum, item) => sum + item.goods.goods_price_min * item.goods_num
        , 0).toFixed(2)
    },
    // 是否全选
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
