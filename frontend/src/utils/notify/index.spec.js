import toast from 'react-hot-toast'
import NotifyMe from './index'

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: jest.fn(),
  success: jest.fn()
}))

describe('notify', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls the success toast interface', () => {
    NotifyMe.success({ id: '123', title: 'Voting', message: 'this is a vote' })
    expect(toast.success).toHaveBeenCalledWith('Voting: this is a vote', {
      id: '123',
      duration: 3000,
      style: {
        background: '#2ecc71',
        color: '#fff'
      }
    })
  })

  it('calls the info toast interface', () => {
    NotifyMe.info({ id: '123', title: 'Voting', message: 'this is a vote' })
    expect(toast).toHaveBeenCalledWith('Voting: this is a vote', {
      id: '123',
      icon: 'ℹ️',
      duration: 3000,
      style: {
        background: '#3498db',
        color: '#fff'
      }
    })
  })

  it('calls the warning toast interface', () => {
    NotifyMe.warning({ id: '123', title: 'Voting', message: 'this is a vote' })
    expect(toast).toHaveBeenCalledWith('Voting: this is a vote', {
      id: '123',
      icon: '⚠️',
      duration: 5000,
      style: {
        background: '#f39c12',
        color: '#fff'
      }
    })
  })

  it('handles messages without titles', () => {
    NotifyMe.success({ id: '456', message: 'just a message' })
    expect(toast.success).toHaveBeenCalledWith('just a message', {
      id: '456',
      duration: 3000,
      style: {
        background: '#2ecc71',
        color: '#fff'
      }
    })
  })
})
