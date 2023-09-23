export default {
  // 此处编写的是Vue组件实例的配置项,通过一定的语法,可以直接混入到组件内部
  // data methods 生命周期函数
//   注意: 如果此处提供了与组件内重名的data 或者 methods ,则组件内的优先级更高
// 如果编写了生命周期函数,则mixins中的生命周期函数 与 页面中的生命周期函数 会用数组管理,统一执行
  created () {
    // console.log('夭玹')
  },
  data () {
    return {
    //   title: '标题'
    }
  },
  methods: {
    loginConfirm () {
      // 判断是否登录
      // 登录----啥也不干---返回false
      // 未登录-----弹窗-----返回true
      // 判断token的有无,没有显示弹窗
      // 有继续请求
      if (!this.$store.getters.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此时需要先登录才能继续操作哟',
          confirmButtonText: '去登陆',
          cancelButtonText: '再逛逛'
        })
          // 点击确认后的逻辑
          .then(() => {
            // 问题:跳转到登录并点击后,不能跳转回来,直接进到了首页
            // 解决:需要跳转去携带参数(当前的路径地址)
            // this.$router.push({
            //   path: '/login',
            //   query: {
            //     backUrl: this.$route.fullPath
            //   }
            // })
            // 问题:商品列表页->商品详情页->登录->商品详情页,当点击返回时,会回到登录页,用户体验不好
            // 希望实现:商品列表->商品详情,直接替换
            // push与replace的区别
            // push:往历史记录里面不断累加
            // replace:不会累加历史记录,直接替换当前

            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {
            // 点击取消后的逻辑
          })
        return true
      }
      return false// 没弹弹窗
    }
  }
}
