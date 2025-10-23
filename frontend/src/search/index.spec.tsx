import { describe, it, expect, beforeEach, mock } from 'bun:test'
import React from 'react'
import { Provider } from 'react-redux'
import { render, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { toggleSearchSidebar } from './actions'
import SearchContainer from './index'

describe('SearchContainer', () => {
  const mockStore = configureMockStore()

  beforeEach(() => {
    // Bun mocks are cleared automatically between tests
  })

  describe('render', () => {
    it('Adding a track works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
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
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: []
        }
      })
      const { getByText, getByAltText } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )

      fireEvent.click(getByText('Find'))
      fireEvent.click(getByAltText('Track name 1'))
      fireEvent.click(getByText('2'))

      const actions = store.getActions()

      // Should dispatch search action when Find button is clicked
      expect(actions).toEqual([
        {
          key: 'searchGetTracks',
          params: {
            options: {
              limit: 20,
              offset: 0
            },
            query: 'happy'
          },
          type: 'actionTrackSearch'
        },
        {
          type: 'actionRemoveFromSearchResults',
          uris: ['https://open.spotify.com/track/0c41pMosF5Kqwwetrack1']
        },
        {
          key: 'tracklist.add',
          params: {
            uris: ['spotify:track:0c41pMosF5Kqwwetrack1']
          },
          type: 'actionSend'
        },
        {
          key: 'searchGetTracks',
          params: {
            options: {
              limit: 20,
              offset: 20
            },
            query: 'happy'
          },
          type: 'actionTrackSearch'
        }
      ])
    })

    it('Adding a track to the mix works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
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
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: []
        }
      })
      const { getAllByText } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      fireEvent.click(getAllByText('Add to mix')[0])

      const actions = store.getActions()
      expect(actions).toEqual([
        {
          type: 'actionRemoveFromSearchResults',
          uris: ['https://open.spotify.com/track/0c41pMosF5Kqwwetrack1']
        },
        {
          track: {
            album: {
              name: 'Album name 1'
            },
            artist: {
              name: 'Artist name 1'
            },
            image: 'image1',
            name: 'Track name 1',
            uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1'
          },
          type: 'curateAddTrackToMix'
        }
      ])
    })

    it('Removing a track from the mix works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
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
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: [
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
        }
      })
      const { getAllByText } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      fireEvent.click(getAllByText('Remove')[0])

      const actions = store.getActions()
      expect(actions).toEqual([
        {
          type: 'curateRemoveTracksFromMix',
          uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack2'
        },
        {
          key: 'searchGetTracks',
          params: {
            options: {
              limit: 20,
              offset: 0
            },
            query: 'happy'
          },
          type: 'actionTrackSearch'
        }
      ])
    })

    it('Adding tracks from the mix works as expected', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
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
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: [
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
            },
            {
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
          ]
        }
      })
      const { getByText } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      fireEvent.click(getByText('Add mix to playlist'))

      expect(store.getActions()).toEqual([
        {
          key: 'tracklist.add',
          params: {
            uris: ['spotify:track:0c41pMosF5Kqwwetrack2', 'spotify:track:0c41pMosF5Kqwwetrack3']
          },
          type: 'actionSend'
        },
        {
          type: 'searchClearMix'
        }
      ])
    })

    it('Swapping tracks from the mix works as expected', () => {
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
              name: 'Track name 1',
              uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1',
              artist: {
                name: 'Artist name 1'
              },
              album: {
                name: 'Album name 1'
              },
              image: 'image1'
            },
            {
              name: 'Track name 2',
              uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1',
              artist: {
                name: 'Artist name 2'
              },
              album: {
                name: 'Album name 2'
              },
              image: 'image2'
            },
            {
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
          ]
        }
      })
      const { getAllByTitle } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const _actions = store.getActions()
      const draggableOpNodeE = getAllByTitle('You can drag this to sort.')[2]
      const createBubbledEvent = (type: any, props = {}) => {
        const event = new Event(type, { bubbles: true })
        Object.assign(event, props)
        return event
      }

      draggableOpNodeE.dispatchEvent(
        createBubbledEvent('drop', {
          dataTransfer: {
            getData: mock(() => '1')
          }
        })
      )

      expect(store.getActions()).toEqual([
        {
          a: 2,
          b: 1,
          type: 'searchSwapTracks'
        }
      ])
    })

    it('Does not add when more than 5 already added', () => {
      const store = mockStore({
        search: {
          activePage: 2,
          limit: 20,
          query: 'happy',
          total: 3200,
          results: [
            {
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
          ],
          searchSideBarOpen: true
        },
        curatedList: {
          tracks: [
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
            },
            {
              name: 'Track name 3',
              uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack3',
              artist: {
                name: 'Artist name 3'
              },
              album: {
                name: 'Album name 3'
              },
              image: 'image3'
            },
            {
              name: 'Track name 4',
              uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack4',
              artist: {
                name: 'Artist name 4'
              },
              album: {
                name: 'Album name 4'
              },
              image: 'image4'
            },
            {
              name: 'Track name 5',
              uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack5',
              artist: {
                name: 'Artist name 5'
              },
              album: {
                name: 'Album name 5'
              },
              image: 'image5'
            },
            {
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
          ]
        }
      })
      const { getByText, getAllByText } = render(
        <Provider store={store}>
          <SearchContainer>
            <span>Close</span>
          </SearchContainer>
        </Provider>
      )
      store.dispatch(toggleSearchSidebar(true))
      fireEvent.click(getAllByText('Add to mix')[0])
      fireEvent.click(getByText('Close'))

      const actions = store.getActions()
      expect(actions).toEqual([
        {
          open: true,
          type: 'actionToggleSearchSidebar'
        },
        {
          open: false,
          type: 'actionToggleSearchSidebar'
        }
      ])
    })
  })
})
