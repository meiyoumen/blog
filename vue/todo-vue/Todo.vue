<template>
  <div class="todolist">
    <h4>TODO LIST<i>(create times {{count}})</i></h4>
    <ul>
      <li v-for="(child, index) in todoList" :key = "index">
        <label>
          <input type="checkbox" :checked="child.isCompleted" @change="toggleCompleted(child)"/>
          <span>{{child.title}}</span>
        </label>
        <button @click="removeItemById(child.id)">x</button>
      </li>
    </ul>
    <input type="text" v-model="newText"/>
    <button @click="createNew(newText)">Add</button>
  </div>
</template>

<script type="text/javascript">
  export default {
    data() {
      return {
        todoList: [],
        newText: '',
        count: 0,
        startIdx: 0
      }
    },
    methods: {
      createNew(title) {
        this.todoList.push({
          title: title,
          id: ++this.startIdx,
          sCompleted: false
        })
        this.count = ++ this.count
        this.newText = ''
        this.$broadcast('getTitle', title)
        this.$bus.emit('getNewTitle',title)
      },
      removeItemById (id){
        this.todoList.forEach((it, i) => {
          it.id === id
          this.todoList.splice(i, 1)
        })
      }
    },
    mounted() {
      this.$bus.on('send', msg => {
        console.log('$bus send', msg)
      })
    }
  }
</script>
