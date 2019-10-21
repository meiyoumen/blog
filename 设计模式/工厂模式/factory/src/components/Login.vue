<!--Created by Administrator on 2019/7/8.-->
<template>
  <div class="Class">
    Login
  </div>
</template>

<script>
  import {routerFactory} from '../router/routerFactory.js'
  export default {
    //...
    methods: {
      userLogin() {
        //请求登陆接口, 获取用户权限, 根据权限调用this.getRoute方法
        //..
       let o = ['superAdmin', 'normalAdmin', 'user']
        this.getRoute('user')
      },

      getRoute(role) {
        console.log('----role', role)
        //根据权限调用routerFactory方法
        let routerObj = routerFactory(role);

        //给vue-router添加该权限所拥有的路由页面
        this.$router.addRoutes(routerObj.route);

        //跳转到相应页面
        this.$router.push({name: routerObj.name})
      }
    },
    mounted(){
      this.userLogin()
    }
  };
</script>
