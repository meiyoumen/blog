//routerFactory.js
import SuperAdmin from '../components/SuperAdmin.vue'
import NormalAdmin from '../components/Admin.vue'
import User from '../components/User.vue'
import NotFound404 from '../components/404.vue'

let AllRoute = [
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

let routerFactory = (role) => {
  switch (role) {
    case 'superAdmin':
      return {
        name: 'SuperAdmin',
        route: AllRoute
      };
      break
    case 'normalAdmin':
      return {
        name: 'NormalAdmin',
        route: AllRoute.splice(1)
      }
      break;
    case 'user':
      return {
        name: 'User',
        route:  AllRoute.splice(2)
      }
      break;
    default:
      throw new Error('参数错误! 可选参数: superAdmin, normalAdmin, user')
  }
}

export { routerFactory }
