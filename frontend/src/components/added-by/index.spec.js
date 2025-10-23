import { describe, it, expect } from 'bun:test'
import React from 'react'
import { render } from '@testing-library/react'
import AddedBy from './index'

const firstUser = {
  user: {
    _id: '123',
    fullname: 'Big Rainbowhead',
    picture: 'link/to/image'
  },
  addedAt: '2019-12-17T13:11:37.316Z',
  playedAt: '2019-12-17T13:11:37.316Z'
}
const secondUser = {
  user: {
    _id: '456',
    fullname: 'Big Rainbowhead2'
  },
  addedAt: '2019-12-17T13:11:37.316Z',
  playedAt: null
}
const thirdUser = {
  addedAt: '2019-12-17T13:11:37.316Z',
  playedAt: null
}

describe('AddedBy', () => {
  describe('when no addedBy information provided', () => {
    it('displays a spotify icon', () => {
      const { container } = render(<AddedBy />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('when addedBy information provided', () => {
    describe('and it is the first play', () => {
      it('displays a current user icon with a popup message', () => {
        const { container } = render(<AddedBy users={[firstUser]} />)
        expect(container).toBeInTheDocument()
      })
    })

    describe('and there is play history', () => {
      it('displays a current user icon with a popup message containing previous', () => {
        const { container } = render(<AddedBy users={[firstUser, secondUser, thirdUser]} />)
        expect(container).toBeInTheDocument()
      })
    })
  })
})
