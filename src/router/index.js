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

export default router
