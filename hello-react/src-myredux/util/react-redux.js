import React, {Component} from 'react'
import PropTypes from 'prop-types'

/**
 * 解决组件 store 传递
 * @param mapStateToProps    将 state 分发到真正的组件中
 * @param mapDispatchToProps 将 dispatch 分发到真正的组件中
 */
const reactRedux = (mapStateToProps, mapDispatchToProps) => {
  return function (WrappedComponent) {
    return (
      class Connect extends Component {
        static contextTypes = {
          store: PropTypes.object
        }

        constructor() {
          super()
          this.state = {
            allProps: {}
          }
        }

        componentWillMount() {
          const {store} = this.context
          this._updateProps()
          store.subscribe(() => this._updateProps())
        }

        _updateProps() {
          const {store} = this.context
          let stateProps = mapStateToProps ?
            mapStateToProps(store.getState(), this.props) : {}
          let dispatchProps = mapDispatchToProps ?
            mapDispatchToProps(store.dispatch, this.props) : {}
          this.setState({
            allProps: {
              ...stateProps,
              ...this.props,
              ...dispatchProps
            }
          })
        }

        render() {
          return (
            <WrappedComponent {...this.state.allProps}></WrappedComponent>
          )
        }

      }
    )
  }
}

/**
 * 提供全局context 组件
 * 解决构造函数中 初始化state 订阅事件
 */
class Provider extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any
  }
  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    return (
      <div>{this.props.children}</div>
    )
  }
}

export {reactRedux, Provider}