import React from 'react'
import ReactDOM from 'react-dom'
import App from '../demo-todo/App'

import {shallow , render , mount ,configure} from 'enzyme'

import Adapter from 'enzyme-adapter-react-16'

configure({adapter : new Adapter()})

// 测试加载，卸载
it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div)
});

// 浅渲染测试标题
test('title should be `TODO_LIST`',()=>{
  const app = shallow(<App></App>)
  expect(app.find('.title').text()).toBe('TODO_LIST')
})

// 测试删除
test('todo-list should remove after click `x` button' , ()=>{

  const app = shallow(<App></App>)
  app.find('.remove').at(0).simulate('click')
  expect(app.find('li').length).toBe(1)

})

// 测试添加
test('todo-list should add one after click `add-button` (input have value) ' , ()=>{

  const app = mount(<App></App>)

  app.find('.input').getDOMNode().value = '111'
  app.find('.add-button').at(0).simulate('click')

  expect(app.find('li').length).toBe(3)
  expect(app.find('li').children('span').at(2).text()).toBe('111')

})

// 测试input无值时的添加
test('todo-list should add one after click `add-button` (input have not value) ' , ()=>{

  const app = mount(<App></App>)

  app.find('.input').getDOMNode().value = ''
  app.find('.add-button').at(0).simulate('click')

  expect(app.find('li').length).toBe(2)

})

// 测试切换

test('todo-list should toggle completed after click item' , ()=>{

  const app = mount(<App></App>)

  var oneItem = app.find('li').at(0).children('span')

  oneItem.simulate('click')
  expect(oneItem.render().css('text-decoration')).toBe('line-through')
  expect(oneItem.render().css('color')).toBe('green')
  expect(app.state().todoList[0].completed).toBe(true)

  oneItem.simulate('click')
  expect(oneItem.render().css('text-decoration')).toBe(undefined)
  expect(oneItem.render().css('color')).toBe(undefined)
  expect(app.state().todoList[0].completed).toBe(false)

})
