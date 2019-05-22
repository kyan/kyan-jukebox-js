import React from 'react'
import { shallow } from 'enzyme'
import RadioStream from './index'

describe('RadioStream', () => {
  it('plays when active', () => {
    const wrapper = shallow(<RadioStream active />)
    expect(wrapper).toMatchSnapshot()
  })

  it('hides when inactive', () => {
    const wrapper = shallow(<RadioStream active={false} />)
    expect(wrapper).toMatchSnapshot()
  })
})
