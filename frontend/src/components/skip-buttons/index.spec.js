import React from 'react'
import { mount } from 'enzyme'
import SkipButtons from './index'

describe('SkipButtons', () => {
  const prevMock = jest.fn()
  const nextMock = jest.fn()
  let wrapper

  describe('render', () => {
    wrapper = mount(<SkipButtons onPrevious={prevMock} onNext={nextMock} />)

    it('renders the as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('handles a prev click', () => {
      prevMock.mockClear()
      wrapper.find('PreviousButton').simulate('click')
      expect(prevMock).toHaveBeenCalled()
    })

    it('handles a next click', () => {
      nextMock.mockClear()
      wrapper.find('NextButton').simulate('click')
      expect(nextMock).toHaveBeenCalled()
    })
  })
})
