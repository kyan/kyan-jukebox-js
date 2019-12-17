import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import SearchContainer from './index'

describe('SearchContainer', () => {
  const mockStore = configureMockStore()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    it('actions', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [{
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
          }],
          searchSideBarOpen: true
        }
      })
      const wrapper = mount(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()
      const event = { target: { value: 'spam' } }
      wrapper.find('SidebarPusher').simulate('click')
      wrapper.find('Form').simulate('submit')
      wrapper.find('.search-list-item').first().simulate('click')
      wrapper.find('input').first().simulate('change', event)
      wrapper.find('Pagination').find('.item').last().simulate('click')
      expect(actions).toMatchSnapshot()
    })
  })
})
