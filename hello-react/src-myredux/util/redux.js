export function createStore(reducer) {
  let [state, listerns] = [null, []]

  const getState = () => {
    return state
  }

  const subscribe = (listenr) => {
    listerns.push(listenr)
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listerns.forEach(listener => listener())
  }
  dispatch({})
  return {
    getState,
    dispatch,
    subscribe
  }
}