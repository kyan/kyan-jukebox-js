import React from 'react'
import { mount } from 'enzyme'
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
    const onPageChangeMock = jest.fn().mockName('onPageChangeMock')

    describe('valid props', () => {
      let tracks = MockTrackListJson()
      tracks[0].track.metrics = null

      const wrapper = mount(
        <Search
          onClose={onCloseMock}
          onSubmit={onSubmitMock}
          onQueryChange={onQueryChangeMock}
          onAddTrack={onAddTrackMock}
          onPageChange={onPageChangeMock}
          results={tracks}
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

      it('does not add a disabled track', () => {
        const track = wrapper.find('SearchItem').first()
        track.simulate('click')
        expect(onAddTrackMock).not.toHaveBeenCalled()
      })

      it('does add a track', () => {
        const track = wrapper.find('SearchItem').at(1)
        track.simulate('click')
        expect(onAddTrackMock).toHaveBeenCalledWith('spotify:track:6BitwTrBfUrTdztRrQiw52')
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
            results={tracks}
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
