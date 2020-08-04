import React from 'react'
import { mount } from 'enzyme'
import SearchItem from './index'

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
const explicitTrack = {
  name: 'track name',
  artist: {
    name: 'artist name'
  },
  album: {
    name: 'album name'
  },
  metrics: {},
  image: 'image1',
  explicit: true
}

describe('SearchItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    const onAddMock = jest.fn().mockName('onAddMock')
    const onClickMock = jest.fn().mockName('onClickMock')

    test('with valid props it renders correctly', () => {
      const wrapper = mount(
        <SearchItem
          className={'item-class'}
          track={validTrack}
          onAdd={onAddMock}
          onClick={onClickMock}
        />
      )

      expect(wrapper).toMatchSnapshot()
      wrapper.find('Image').simulate('click')
      expect(onClickMock).toHaveBeenCalled()
      wrapper.find('.search-list-item__add').simulate('click')
      expect(onAddMock).toHaveBeenCalled()
    })

    test('with explicit track', () => {
      const wrapper = mount(
        <SearchItem
          className={'item-class'}
          track={explicitTrack}
          onAdd={onAddMock}
          onClick={onClickMock}
        />
      )

      expect(wrapper).toMatchSnapshot()
      wrapper.find('Image').simulate('click')
      expect(onClickMock).not.toHaveBeenCalled()
      wrapper.find('.search-list-item__add').simulate('click')
      expect(onAddMock).toHaveBeenCalled()
    })

    test('with no add handler', () => {
      const wrapper = mount(
        <SearchItem className={'item-class'} track={validTrack} onClick={onClickMock} />
      )

      expect(wrapper).toMatchSnapshot()
      wrapper.find('Image').simulate('click')
      expect(onClickMock).toHaveBeenCalled()
      expect(wrapper.find('.search-list-item__add')).toHaveLength(0)
    })
  })
})
