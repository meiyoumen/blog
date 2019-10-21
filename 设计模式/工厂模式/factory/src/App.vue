<template>
 <div id="app">
   <h5>Hello App!</h5>
   <p>
     <router-link to="/login">Login</router-link>&nbsp;&nbsp;
     <router-link to="/super-admin">super-admin</router-link>&nbsp;&nbsp;
     <router-link to="/normal-admin">normal-admin</router-link>&nbsp;&nbsp;
     <router-link to="/user">user</router-link>
   </p>
   <router-view></router-view>
 </div>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'app',
  components: {
    Login
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
