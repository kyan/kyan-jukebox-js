import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import MockTrackListJson from '__mockData__/api'
import Search from './index'

describe('Search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    const onCloseMock = jest.fn().mockName('onCloseMock')
    const onSubmitMock = jest.fn().mockName('onSubmitMock')
    const onQueryChangeMock = jest.fn().mockName('onQueryChangeMock')
    const onAddTrackMock = jest.fn().mockName('onAddTrackMock')
    const onAddTracksMock = jest.fn().mockName('onAddTracksMock')
    const onPageChangeMock = jest.fn().mockName('onPageChangeMock')
    const onAddTrackToMixMock = jest.fn().mockName('onAddTrackToMixMock')
    const onRemoveFromMixMock = jest.fn().mockName('onRemoveFromMixMock')
    const onSwapTracksMock = jest.fn().mockName('onSwapTracksMock')

    describe('valid props', () => {
      const curatedList = [
        {
          name: 'Track name 2',
          uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack2',
          artist: {
            name: 'Artist name 2'
          },
          album: {
            name: 'Album name 2'
          },
          image: 'image2'
        }
      ]
      const tracks = MockTrackListJson()
      tracks[0].metrics = null

      test('everything renders as expected', () => {
        const { asFragment } = render(
          <Search
            onClose={onCloseMock}
            onSubmit={onSubmitMock}
            onQueryChange={onQueryChangeMock}
            onAddTrack={onAddTrackMock}
            onAddTracks={onAddTracksMock}
            onSwapTracks={onSwapTracksMock}
            onAddTrackToMix={onAddTrackToMixMock}
            onRemoveFromMix={onRemoveFromMixMock}
            onPageChange={onPageChangeMock}
            results={tracks}
            curatedList={curatedList}
            totalPages={2}
            visible
            query=''
          />
        )
        expect(asFragment().firstChild).toMatchSnapshot()
      })

      test('it adds a track when the track image is clicked', () => {
        const { getByAltText } = render(
          <Search
            onClose={onCloseMock}
            onSubmit={onSubmitMock}
            onQueryChange={onQueryChangeMock}
            onAddTrack={onAddTrackMock}
            onAddTracks={onAddTracksMock}
            onSwapTracks={onSwapTracksMock}
            onAddTrackToMix={onAddTrackToMixMock}
            onRemoveFromMix={onRemoveFromMixMock}
            onPageChange={onPageChangeMock}
            results={tracks}
            curatedList={curatedList}
            totalPages={2}
            visible
            query=''
          />
        )
        const track = tracks[1].name
        fireEvent.click(getByAltText(track))
        expect(onAddTrackMock).toHaveBeenCalledWith('spotify:track:6BitwTrBfUrTdztRrQiw52')
      })

      test('it does not add a explicit track when the track image is clicked', () => {
        const { getByAltText } = render(
          <Search
            onClose={onCloseMock}
            onSubmit={onSubmitMock}
            onQueryChange={onQueryChangeMock}
            onAddTrack={onAddTrackMock}
            onAddTracks={onAddTracksMock}
            onSwapTracks={onSwapTracksMock}
            onAddTrackToMix={onAddTrackToMixMock}
            onRemoveFromMix={onRemoveFromMixMock}
            onPageChange={onPageChangeMock}
            results={tracks}
            curatedList={curatedList}
            totalPages={2}
            visible
            query=''
          />
        )
        const track = tracks[0].name
        fireEvent.click(getByAltText(track))
        expect(onAddTrackMock).not.toHaveBeenCalled()
      })

      test('it does add a track to the mix when clicking Add to Mix', () => {
        const { getAllByText } = render(
          <Search
            onClose={onCloseMock}
            onSubmit={onSubmitMock}
            onQueryChange={onQueryChangeMock}
            onAddTrack={onAddTrackMock}
            onAddTracks={onAddTracksMock}
            onSwapTracks={onSwapTracksMock}
            onAddTrackToMix={onAddTrackToMixMock}
            onRemoveFromMix={onRemoveFromMixMock}
            onPageChange={onPageChangeMock}
            results={tracks}
            curatedList={curatedList}
            totalPages={2}
            visible
            query=''
          />
        )
        fireEvent.click(getAllByText('Add to mix')[0])
        expect(onAddTrackToMixMock).toHaveBeenCalledWith(tracks[0])
      })
    })
  })
})
