import { describe, it, expect, beforeEach, mock } from 'bun:test'
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import MockTrackListJson from '__mockData__/api'
import CurrentTrack from './index'

describe('CurrentTrack', () => {
  let track

  beforeEach(() => {
    // Bun mocks are cleared automatically between tests
  })

  describe('render', () => {
    describe('album', () => {
      it('renders track', () => {
        const voteMock = mock(() => {})
        track = MockTrackListJson()[1]
        track.metrics = null
        const store = configureMockStore()({
          timer: { duration: 10000, position: 8000, remaining: 700 },
          track
        })
        delete track.album.year

        const { getAllByText } = render(
          <Provider store={store}>
            <CurrentTrack
              userID='1117795953801840xxxxx'
              track={track}
              progress={25}
              remaining={5}
              onVote={voteMock}
            />
          </Provider>
        )

        // Test that the track is rendered - use getAllByText to handle multiple matches
        expect(getAllByText(track.name)).toHaveLength(2)
      })

      it('renders and average vote that was < 50', () => {
        const voteMock = mock(() => {})
        track = MockTrackListJson()[0]
        const store = configureMockStore()({
          timer: { duration: 10000, position: 8000, remaining: 700 },
          track
        })
        delete track.album.year

        render(
          <Provider store={store}>
            <CurrentTrack
              userID='1117795953801840xxxxx'
              track={track}
              progress={25}
              remaining={5}
              onVote={voteMock}
            />
          </Provider>
        )

        // Test that rating container is present
        expect(document.querySelector('.track-rating-container')).toBeInTheDocument()
      })

      it('renders and average vote that was 0', () => {
        const voteMock = mock(() => {})
        track = MockTrackListJson()[2]
        const store = configureMockStore()({
          timer: { duration: 10000, position: 8000, remaining: 700 },
          track
        })
        delete track.album.year

        render(
          <Provider store={store}>
            <CurrentTrack
              userID='1117795953801840xxxxx'
              track={track}
              progress={25}
              remaining={5}
              onVote={voteMock}
            />
          </Provider>
        )

        // Test that rating container is present
        expect(document.querySelector('.track-rating-container')).toBeInTheDocument()
      })
    })
  })

  describe('when no track', () => {
    it('renders nothing playing message', () => {
      const { container, getByText } = render(<CurrentTrack />)

      expect(container.firstChild).not.toBeNull()
      expect(getByText('Nothing playing')).toBeInTheDocument()
      expect(getByText('Drag some music here or press play.')).toBeInTheDocument()
    })
  })

  describe('when no image', () => {
    it('renders default image', () => {
      track = MockTrackListJson()[0]
      const store = configureMockStore()({
        timer: { duration: 10000, position: 8000, remaining: 700 },
        track
      })

      const { getAllByRole } = render(
        <Provider store={store}>
          <CurrentTrack track={track} progress={25} />
        </Provider>
      )

      // Test that an image is rendered
      const images = getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
    })
  })

  describe('when missing data', () => {
    it('renders defaults', () => {
      track = MockTrackListJson()[2]
      delete track.addedBy
      delete track.album
      const store = configureMockStore()({
        timer: { duration: 10000, position: 8000, remaining: 700 },
        track
      })

      const { getAllByText } = render(
        <Provider store={store}>
          <CurrentTrack track={track} progress={25} />
        </Provider>
      )

      // Test that the component renders with default values - use getAllByText to handle multiple matches
      expect(getAllByText(track.name)).toHaveLength(1)
    })
  })
})
