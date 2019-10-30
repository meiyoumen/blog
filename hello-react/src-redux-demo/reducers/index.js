import { combineReducers } from 'redux'

/**
 *
 * 将拆分的 visibilityFilter 和 todos 这两个 reducers 合并到todoApp
 */
import todos from './todos'
import visibilityFilter from './visibilityFilter'

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
