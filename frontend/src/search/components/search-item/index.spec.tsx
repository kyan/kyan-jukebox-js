import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SearchItem from './index'

const validTrack = {
  name: 'track name',
  artist: {
    name: 'artist name'
  },
  album: {
    name: 'album name'
  },
  metrics: {
    votes: 2,
    votesAverage: 12
  },
  image: 'image',
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
  metrics: {
    votes: 2,
    votesAverage: 12
  },
  image: 'image',
  explicit: true
}
const trackWithNoMetrics = {
  name: 'track name',
  artist: {
    name: 'artist name'
  },
  album: {
    name: 'album name'
  },
  image: 'image',
  explicit: true
}

describe('SearchItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    const onAddMock = jest.fn().mockName('onAddMock')
    const onClickMock = jest.fn().mockName('onClickMock')

    test('with normal track OK', () => {
      const { asFragment } = render(
        <SearchItem
          className={'item-class'}
          track={validTrack}
          onAdd={onAddMock}
          onClick={onClickMock}
        />
      )
      expect(asFragment().firstChild).toMatchSnapshot()
    })

    test('with explicit track OK', () => {
      const { asFragment, getByAltText } = render(
        <SearchItem className={'item-class'} track={explicitTrack} onClick={onClickMock} />
      )
      expect(asFragment().firstChild).toMatchSnapshot()
      fireEvent.click(getByAltText('track name'))
      expect(onClickMock).toHaveBeenCalledTimes(0)
    })

    test('with no metrics OK', () => {
      const { asFragment } = render(
        <SearchItem className={'item-class'} track={trackWithNoMetrics} onClick={onClickMock} />
      )
      expect(asFragment().firstChild).toMatchSnapshot()
    })

    test('clicking image adds track', () => {
      const { getByAltText } = render(
        <SearchItem className={'item-class'} track={validTrack} onClick={onClickMock} />
      )
      fireEvent.click(getByAltText('track name'))
      expect(onClickMock).toHaveBeenCalledTimes(1)
    })

    test('clicking add to mix works OK when callback provided', () => {
      const { getByText } = render(
        <SearchItem
          className={'item-class'}
          track={validTrack}
          onAdd={onAddMock}
          onClick={onClickMock}
        />
      )
      fireEvent.click(getByText('Add to mix'))
      expect(onAddMock).toHaveBeenCalledTimes(1)
    })

    test('add to mix not shown when callback not provided', () => {
      const { queryByText } = render(
        <SearchItem className={'item-class'} track={validTrack} onClick={onClickMock} />
      )
      expect(queryByText('Add to mix')).toBeNull()
    })
  })
})
