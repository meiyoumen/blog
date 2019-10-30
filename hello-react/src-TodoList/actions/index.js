export const ADD_TODO = 'ADD_TODO'
export let addTodo = (id, text) => ({
  type: ADD_TODO,
  id, text
})

export const TOGGLE_TODO = 'TOGGLE_TODO'
export let toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  id
})


export const SWITCH_FILTER = 'SWITCH_FILTER'
export let switchFilter = (filter) => (
  {
    type : SWITCH_FILTER,
    filter
  }
)