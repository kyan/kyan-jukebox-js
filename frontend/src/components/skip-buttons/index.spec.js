import React from 'react'
import { shallow } from 'enzyme'
import SkipButtons from './index'

describe('SkipButtons', () => {
  const prevMock = jest.fn()
  const nextMock = jest.fn()
  let wrapper

  describe('render', () => {
    wrapper = shallow(
      <SkipButtons
        onPrevious={prevMock}
        onNext={nextMock}
      />
    )

    it('renders the as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('handles a prev click', () => {
      prevMock.mockClear()
      wrapper.find('.jb-previous-button').simulate('click')
      expect(prevMock.mock.calls.length).toEqual(1)
    })

    it('handles a next click', () => {
      nextMock.mockClear()
      wrapper.find('.jb-next-button').simulate('click')
      expect(nextMock.mock.calls.length).toEqual(1)
    })
  })
})
