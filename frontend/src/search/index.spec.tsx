import React from 'react'
import { Provider } from 'react-redux'
import { render, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { toggleSearchSidebar } from 'search/actions'
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
          searchSideBarOpen: false
        },
        curatedList: {
          tracks: []
        }
      })
      const { getByText, getByAltText, getByLabelText } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      store.dispatch(toggleSearchSidebar(true))
      const actions = store.getActions()
      const event = { target: { value: 'spam' } }

      fireEvent.click(getByText('Find'))
      fireEvent.click(getByAltText('Track name 1'))
      fireEvent.change(getByLabelText('search-input'), event)
      fireEvent.click(getByText('2'))

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
      const { getAllByText } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()

      fireEvent.click(getAllByText('Add to mix')[0])
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
      const { getAllByText } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()

      fireEvent.click(getAllByText('Remove')[0])
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
      const { getByText } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()

      fireEvent.click(getByText('Add mix to playlist'))
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
            },
            {
              track: {
                name: 'Track name 2',
                uri: 'https://open.spotify.com/track/0c41pMosF5Kqwwetrack1',
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
      const { getAllByTitle } = render(
        <Provider store={store}>
          <SearchContainer />
        </Provider>
      )
      const actions = store.getActions()
      const draggableOpNodeE = getAllByTitle('You can drag this to sort.')[2]
      const createBubbledEvent = (type: any, props = {}) => {
        const event = new Event(type, { bubbles: true })
        Object.assign(event, props)
        return event
      }

      draggableOpNodeE.dispatchEvent(
        createBubbledEvent('drop', {
          dataTransfer: {
            getData: jest.fn().mockReturnValue('1')
          }
        })
      )

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
      const { getByText, getAllByText } = render(
        <Provider store={store}>
          <SearchContainer>
            <span>Close</span>
          </SearchContainer>
        </Provider>
      )
      const actions = store.getActions()
      store.dispatch(toggleSearchSidebar(true))
      fireEvent.click(getAllByText('Add to mix')[0])
      fireEvent.click(getByText('Close'))

      expect(actions).toMatchSnapshot()
    })
  })
})
