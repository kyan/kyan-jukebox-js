import { describe, it, expect, beforeEach } from 'bun:test'
import React from 'react'
import { render } from '@testing-library/react'
import VotedBy from './index'

describe('VotedBy', () => {
  beforeEach(() => {
    // Bun mocks are cleared automatically between tests
  })

  describe('render', () => {
    const mockVotes = [
      {
        at: '2020-01-27T20:20:37.904Z',
        vote: 80,
        user: {
          _id: '1',
          fullname: 'John Doe',
          picture: 'https://example.com/john.jpg'
        }
      },
      {
        at: '2020-01-27T20:20:50.355Z',
        vote: 60,
        user: {
          _id: '2',
          fullname: 'Jane Smith',
          picture: 'https://example.com/jane.jpg'
        }
      }
    ]

    it('renders with votes when show is true', () => {
      const { container } = render(<VotedBy show={true} votes={mockVotes} total={70} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders nothing when show is false', () => {
      const { container } = render(<VotedBy show={false} votes={mockVotes} total={70} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders just vote label when no votes provided', () => {
      const { container } = render(<VotedBy show={true} votes={[]} total={50} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with positive vote total', () => {
      const { container } = render(<VotedBy show={true} votes={[]} total={80} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with negative vote total', () => {
      const { container } = render(<VotedBy show={true} votes={[]} total={20} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with ribbon prop', () => {
      const { container } = render(
        <VotedBy show={true} votes={mockVotes} total={70} ribbon={true} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with custom size', () => {
      const { container } = render(<VotedBy show={true} votes={[]} total={50} size='small' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles votes with missing user data', () => {
      const votesWithMissingUser = [
        {
          at: '2020-01-27T20:20:37.904Z',
          vote: 80,
          user: null
        }
      ]
      const { container } = render(<VotedBy show={true} votes={votesWithMissingUser} total={80} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
