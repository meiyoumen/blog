export function reducer(state, action) {
  if (!state) {
    return {
      title: '在reducer中初始化的title state',
      content: '在reducer初始化的content state'
    }
  }
  switch (action.type) {
    case 'CHANGE_TITLE' :
      return {
        ...state,
        title: action.text
      }
      break
    case 'CHANGE_CONTENT' :
      return {
        ...state,
        content: action.text
      }
      break
    default:
      return state
  }
}