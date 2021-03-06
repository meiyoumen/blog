import {ADD_TODO, TOGGLE_TODO} from '../actions'

let todoReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          isDone: false
        }
      ]
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.id ? {...todo, isDone: !todo.isDone} : todo
      )
    default:
      return state
  }
}

export default todoReducer