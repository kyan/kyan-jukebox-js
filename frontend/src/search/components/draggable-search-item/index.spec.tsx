import React from 'react'
import { mount } from 'enzyme'
import DraggableSearchItem from './index'

const validTrack = {
  name: 'track name',
  artist: {
    name: 'artist name'
  },
  album: {
    name: 'album name'
  },
  metrics: {},
  image: 'image1',
  explicit: false
}

describe('DraggableSearchItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    const onClickMock = jest.fn().mockName('onClickMock')
    const onRemoveMock = jest.fn().mockName('onRemoveMock')
    const swapMock = jest.fn().mockName('swapMock')

    test('with valid props it renders correctly', () => {
      const wrapper = mount(
        <DraggableSearchItem
          i={1}
          action={swapMock}
          track={validTrack}
          onClick={onClickMock}
          onRemove={onRemoveMock}
        />
      )

      expect(wrapper).toMatchSnapshot()
      wrapper.find('.search-list-item__remove').simulate('click')
      expect(onRemoveMock).toHaveBeenCalled()
    })
  })
})
