import React from 'react'
import {shallow, render, mount, configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Link from '../demo-test/Link'

configure({
  adapter: new Adapter()
})

test('Link组件的文本应该等于传入的props.label', () => {
  var link = shallow(<Link label="百毒不侵"></Link>)

  expect(
    link.text()
  ).toEqual('百毒不侵')
})
