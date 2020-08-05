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
    test('Adding a track works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
              track: {
                name: 'Track name 1',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1',
                artist: {
                  name: 'Artist name 1'
                },
                album: {
                  name: 'Album name 1'
                },
                image: 'image1'
              }
            }
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: []
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
      wrapper.find('.search-list-item .search-list-item__image').first().simulate('click')
      wrapper.find('input').first().simulate('change', event)
      wrapper.find('Pagination').find('.item').last().simulate('click')
      expect(actions).toMatchSnapshot()
    })

    test('Adding a track to the mix works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
              track: {
                name: 'Track name 1',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1',
                artist: {
                  name: 'Artist name 1'
                },
                album: {
                  name: 'Album name 1'
                },
                image: 'image1'
              }
            }
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: []
        }
      })
      const wrapper = mount(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()
      wrapper.find('SidebarPusher').simulate('click')
      wrapper.find('.search-list-item .search-list-item__add').first().simulate('click')
      expect(actions).toMatchSnapshot()
    })

    test('Removing a track from the mix works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
              track: {
                name: 'Track name 1',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1',
                artist: {
                  name: 'Artist name 1'
                },
                album: {
                  name: 'Album name 1'
                },
                image: 'image1'
              }
            }
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: [
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
        }
      })
      const wrapper = mount(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()
      wrapper.find('SidebarPusher').simulate('click')
      wrapper
        .find('.search-list-item-draggable .search-list-item__remove')
        .first()
        .simulate('click')
      expect(actions).toMatchSnapshot()
    })

    test('Adding tracks from the mix works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
              track: {
                name: 'Track name 1',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1',
                artist: {
                  name: 'Artist name 1'
                },
                album: {
                  name: 'Album name 1'
                },
                image: 'image1'
              }
            }
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: [
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
            },
            {
              track: {
                name: 'Track name 3',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack3',
                artist: {
                  name: 'Artist name 3'
                },
                album: {
                  name: 'Album name 3'
                },
                image: 'image3'
              }
            }
          ]
        }
      })
      const wrapper = mount(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()
      wrapper.find('SidebarPusher').simulate('click')
      wrapper.find('.search-list-item__add_to_mix').first().simulate('click')
      expect(actions).toMatchSnapshot()
    })

    test('Swapping tracks from the mix works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: [
            {
              track: {
                name: 'Track name 3',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack3',
                artist: {
                  name: 'Artist name 3'
                },
                album: {
                  name: 'Album name 3'
                },
                image: 'image3'
              }
            }
          ]
        }
      })
      const wrapper = mount(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()
      //@ts-ignore
      wrapper.find('DraggableSearchItem').props().action('1', '3')
      expect(actions).toMatchSnapshot()
    })

    test('Does not add when more than 5 already added', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
              track: {
                name: 'Track name 1',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1',
                artist: {
                  name: 'Artist name 1'
                },
                album: {
                  name: 'Album name 1'
                },
                image: 'image1'
              }
            }
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: [
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
            },
            {
              track: {
                name: 'Track name 3',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack3',
                artist: {
                  name: 'Artist name 3'
                },
                album: {
                  name: 'Album name 3'
                },
                image: 'image3'
              }
            },
            {
              track: {
                name: 'Track name 4',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack4',
                artist: {
                  name: 'Artist name 4'
                },
                album: {
                  name: 'Album name 4'
                },
                image: 'image4'
              }
            },
            {
              track: {
                name: 'Track name 5',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack5',
                artist: {
                  name: 'Artist name 5'
                },
                album: {
                  name: 'Album name 5'
                },
                image: 'image5'
              }
            },
            {
              track: {
                name: 'Track name 6',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack6',
                artist: {
                  name: 'Artist name 6'
                },
                album: {
                  name: 'Album name 6'
                },
                image: 'image6'
              }
            }
          ]
        }
      })
      const wrapper = mount(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()
      wrapper.find('SidebarPusher').simulate('click')
      wrapper.find('.search-list-item .search-list-item__add').first().simulate('click')
      expect(actions).toMatchSnapshot()
    })
  })
})
