import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login'
import Layout from '@/views/layout'
import Home from '@/views/home'
import Article from '@/views/article'
import Image from '@/views/image'
import Publish from '@/views/publish'
import Comment from '@/views/comment'
import Fans from '@/views/fans'
import Settings from '@/views/settings'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))

  if (to.path !== '/login') {
    // 不是登录页面
    if (user) {
      // 有user即已登录，允许通过
      next()
    } else {
      // 没有登录，跳转登录页面
      next('/login')
    }
  } else {
    // 是登录页面，允许正常通过
    next()
  }
})

export default router
