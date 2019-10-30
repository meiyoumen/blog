import {SWITCH_FILTER} from '../actions'

const filterReducer = (state = {filter: 'all'}, action) => {
  switch (action.type) {
    case SWITCH_FILTER :
      return {
        filter: action.filter
      }
    default:
      return state
  }
}
export default filterReducer