let initialState = {
  visibilityFilter: 'SHOW_ALL',
  todos: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            id: action.id,
            text: action.text,
            completed: false
          }
        ]
      })
    case 'UPDATE_TODO':
      return Object.assign({}, state, {
        todos: state.todos.map(todo =>
          todo.id === action.id ?
            { ...todo, text: action.text } :
            todo
        )
      })
    case 'DELETE_TODO':
      return Object.assign({}, state, {
        todos: state.todos.filter(todo =>
          todo.id !== action.id
        )

      })
    case 'COMPLETE_TODO':
      return Object.assign({}, state, {
        todos: state.todos.map(todo =>
          todo.id === action.id ?
            { ...todo, completed: !todo.completed} :
            todo
        )
      })
    case 'SET_VISIBILITY_FILTER':
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
