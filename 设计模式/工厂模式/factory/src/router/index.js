// index.js

import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login.vue'
import SuperAdmin from '../components/SuperAdmin.vue'
import NormalAdmin from '../components/Admin.vue'
import User from '../components/User.vue'
import NotFound404 from '../components/404.vue'
Vue.use(Router)

export default new Router({
  routes: [
    //重定向到登录页
    {
      path: '/',
      redirect: '/login'
    },
    //登陆页
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    //超级管理员页面
    {
      path: '/super-admin',
      name: 'SuperAdmin',
      component: SuperAdmin
    },
    //普通管理员页面
    {
      path: '/normal-admin',
      name: 'NormalAdmin',
      component: NormalAdmin
    },
    //普通用户页面
    {
      path: '/user',
      name: 'User',
      component: User
    },
    //404页面
    {
      path: '*',
      name: 'NotFound404',
      component: NotFound404
    }
  ]
})
