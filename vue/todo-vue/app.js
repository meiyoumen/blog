import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './App.vue'
import { install as Broadcast } from './util/broadcast.js'
import {install as EventBus} from './util/eventbus.js'

Vue.use(Broadcast)
Vue.use(EventBus)
let router = new VueRouter({
  routes: [
    {
      name: "Home",
      path: "/",
      component: Home
    }
  ]
})
let app = new Vue({
  router,
	el: '#app'
})
export default app
