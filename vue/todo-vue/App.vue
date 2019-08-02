<template>
  <div class="main">
    <div>{{msg}} -- {{title}} -- {{newTitle}}</div>
    <button type="button" @click="send()">Send</button>
    <Todo></Todo>
  </div>
</template>

<script type="text/javascript">
  import Todo from './Todo.vue'
  export default {
    data () {
      return {
        msg: 'Hello',
        title: 'World',
        newTitle: 'newTitle'
      }
    },
    components: {
      Todo
    },
    events: {
      getTitle(arg) {
        this.title = arg || 'World'
        console.log('[$broadcast.getTitle]', this.msg, arg)
      }
    },
    methods: {
      send() {
        this.$bus.emit('send', this)
      }
    },
    mounted() {
      console.log('home', this)
      this.$bus.on('getNewTitle', (arg) => {
        this.newTitle = arg
        console.log('[$bus.getNewTitle]', this.newTitle, arg)
      })
    }
  }
</script>
