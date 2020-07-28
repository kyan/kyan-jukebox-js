import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
jest.mock('react-use-googlelogin')

describe('App', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).toMatchSnapshot()
  })
})
