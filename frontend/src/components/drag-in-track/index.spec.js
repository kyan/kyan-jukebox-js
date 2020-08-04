import React from 'react'
import { shallow } from 'enzyme'
import DragInTrack from './index'

describe('DragInTrack', () => {
  const onDropMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    describe('when controls disabled', () => {
      it('renders as expected', () => {
        const wrapper = shallow(
          <DragInTrack disabled onDrop={onDropMock}>
            <span>Hello World</span>
          </DragInTrack>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when controls enabled', () => {
      it('renders as expected', () => {
        const wrapper = shallow(
          <DragInTrack disabled={false} onDrop={onDropMock}>
            <span>Hello World</span>
          </DragInTrack>
        )

        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
