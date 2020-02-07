import React from 'react'
import { mount } from 'enzyme'
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
    const onPageChangeMock = jest.fn().mockName('onPageChangeMock')

    describe('valid props', () => {
      const track1 = {
        track: {
          name: 'Track name 1',
          uri: 'track1',
          artist: {
            name: 'Artist name 1'
          },
          album: {
            name: 'Album name 1'
          },
          image: 'image1'
        }
      }
      const track2 = {
        track: {
          explicit: true,
          name: 'Track name 2',
          uri: 'track2',
          artist: {
            name: 'Artist name 2'
          },
          album: {
            name: 'Album name 2'
          },
          image: 'image2'
        }
      }
      const wrapper = mount(
        <Search
          onClose={onCloseMock}
          onSubmit={onSubmitMock}
          onQueryChange={onQueryChangeMock}
          onAddTrack={onAddTrackMock}
          onPageChange={onPageChangeMock}
          results={[track1, track2]}
          totalPages={2}
          visible
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('focuses the search input onShow', () => {
        const input = wrapper.find('input')
        const sidebar = wrapper.find('Sidebar')
        sidebar.prop('onShow')()
        expect(input.get(0).ref.current).toEqual(document.activeElement)
      })

      it('adds a track', () => {
        const track = wrapper.find('.search-list-item').first()
        track.simulate('click')
        expect(onAddTrackMock).toHaveBeenCalledWith('track1')
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
            onPageChange={onPageChangeMock}
            results={[track1, track2]}
            totalPages={2}
            visible={false}
          />
        )
        const sidebar = wrapper.find('SidebarPusher')
        sidebar.simulate('click')
        expect(onCloseMock).not.toHaveBeenCalled()
      })
    })
  })
})
