import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入一级路由组件
import Login from '@/views/login/index.vue'
import Layout from '@/views/layout/index.vue'
import Search from '@/views/search'
import Pay from '@/views/pay/index.vue'
import MyOrder from '@/views/myorder'
import ProDetail from '@/views/prodetail'
import SearchList from '@/views/search/list'
// 导入二级路由组件
import Home from '@/views/layout/home.vue'
import Cart from '@/views/layout/cart.vue'
import Category from '@/views/layout/category.vue'
import User from '@/views/layout/user.vue'
import store from '@/store'

Vue.use(VueRouter)
// 路由规则,数组里面包对象
const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    redirect: '/home', // 重定向到home 组件
    // 二级路由
    children: [
      { path: '/home', component: Home },
      { path: '/cart', component: Cart },
      { path: '/category', component: Category },
      { path: '/user', component: User }
    ]
  },
  { path: '/search', component: Search },
  { path: '/searchlist', component: SearchList },
  { path: '/pay', component: Pay },
  { path: '/myorder', component: MyOrder },
  // 动态路由传参,确认将来是哪个商品,路由参数中携带id
  { path: '/prodetail/:id', component: ProDetail }

]

const router = new VueRouter({
  routes
})
// 所有的路由在被真正访问到之前(解析渲染对应的组件页面之前),都先经过全局前置守卫
// 只有全局前置守卫放行了,才能到达对应的页面

// 全局前置导航守卫
// to: 到哪去,到哪去的完整的路由信息对象(路径,参数)
// from: 从哪来,从哪来的完整的路由信息对象(路径,参数)
// next():是否放行
// 1.next() 直接放行,放行到to要去的路径
// 2.next(路径) 进行拦截,拦截到next里面配置的路径

// 定义权限访问的页面
const authUrl = ['/pay', '/myorder']
router.beforeEach((to, from, next) => {
  const token = store.state.user.userInfo.token
  if (!authUrl.includes(to.path)) {
    // 非权限页面,直接放行
    next()
    // return
  } else {
    // 权限页面,判断token
  // 问题:
  // 为什么这样写不对

    // if (token !== null) {
    //   next()
    // } else {
    //   next('/login')
    // }

    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
