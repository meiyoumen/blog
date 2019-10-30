import {combineReducers} from 'redux'
import todoReducer from './todo'
import filterReducer from './filter'
let appReducer = combineReducers({todoReducer,filterReducer})

export default appReducer

// export const appReducer = combineReducers({todoReducer, filterReducer})