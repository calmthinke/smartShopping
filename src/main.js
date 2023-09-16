import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/utils/vant-ui'// 导入vant组件
import '@/styles/common.less'// 导入公共的样式

// 1. vant 组件的全部导入
// import Vant from 'vant'
// import 'vant/lib/index.css'

// Vue.use(Vant)// 插件安装初始化,内部会将vant所有组件进行导入注册

// // 2. vant 组件的按需导入------防止越写越多,抽离放到放到utils/目录下
// import { Button } from 'vant'
// import 'vant/lib/button/style'
// Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
