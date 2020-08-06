import React from 'react'
import { render, fireEvent } from '@testing-library/react'
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
    const onRemoveMock = jest.fn().mockName('onRemoveMock')
    const swapMock = jest.fn().mockName('swapMock')

    test('with valid props it renders correctly', () => {
      const { asFragment } = render(
        <DraggableSearchItem i={1} action={swapMock} track={validTrack} onRemove={onRemoveMock} />
      )
      expect(asFragment().firstChild).toMatchSnapshot()
    })

    test('clicking remove link removes track from list', () => {
      const { getByText } = render(
        <DraggableSearchItem i={1} action={swapMock} track={validTrack} onRemove={onRemoveMock} />
      )
      fireEvent.click(getByText('Remove'))
      expect(onRemoveMock).toHaveBeenCalledTimes(1)
    })

    test('onDrop', () => {
      const getDataMock = jest.fn().mockReturnValue('20')
      const { getByTitle } = render(
        <DraggableSearchItem i={1} action={swapMock} track={validTrack} onRemove={onRemoveMock} />
      )
      fireEvent.drop(getByTitle('You can drag this to sort.'), {
        dataTransfer: {
          getData: getDataMock
        }
      })
      expect(getDataMock).toHaveBeenCalledWith('text/plain')
      expect(swapMock).toHaveBeenCalledWith(1, 20)
    })

    test('onDragStart', () => {
      const setDataMock = jest.fn()
      const { getByTitle } = render(
        <DraggableSearchItem i={1} action={swapMock} track={validTrack} onRemove={onRemoveMock} />
      )
      fireEvent.dragStart(getByTitle('You can drag this to sort.'), {
        dataTransfer: {
          setData: setDataMock
        }
      })
      expect(setDataMock).toHaveBeenCalledWith('text/plain', '1')
    })
  })
})
