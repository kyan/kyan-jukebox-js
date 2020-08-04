import React from 'react'
import { mount } from 'enzyme'
import MockTrackListJson from '__mockData__/api'
import { Sidebar } from 'semantic-ui-react'
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
      let curatedList = [
        {
          track: {
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
        }
      ]
      let tracks = MockTrackListJson()
      tracks[0].track.metrics = null

      const wrapper = mount(
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

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('focuses the search input onShow', () => {
        const input = wrapper.find('input')
        const sidebar = wrapper.find(Sidebar)
        // @ts-ignore
        sidebar.prop('onShow')()
        // @ts-ignore
        expect(input.get(0).ref.current).toEqual(document.activeElement)
      })

      it('does not add a disabled track', () => {
        const track = wrapper.find('SearchItem').first()
        track.simulate('click')
        expect(onAddTrackMock).not.toHaveBeenCalled()
      })

      it('does add a track', () => {
        const track = wrapper.find('SearchItem').at(2).find('Image')
        track.simulate('click')
        expect(onAddTrackMock).toHaveBeenCalledWith('spotify:track:6BitwTrBfUrTdztRrQiw52')
      })

      it('does add a track to the mix', () => {
        const track = wrapper.find('SearchItem').at(3).find('.search-list-item__add')
        track.simulate('click')
        expect(onAddTrackToMixMock).toHaveBeenCalledWith(tracks[2].track)
      })

      it('closes the sidebar', () => {
        const sidebar = wrapper.find('SidebarPusher')
        sidebar.simulate('click')
        expect(onCloseMock).toHaveBeenCalled()
      })

      it('ignores closing the sidebar', () => {
        const wrapper = mount(
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
            visible={false}
            query=''
          />
        )
        const sidebar = wrapper.find('SidebarPusher')
        sidebar.simulate('click')
        expect(onCloseMock).not.toHaveBeenCalled()
      })
    })
  })
})
