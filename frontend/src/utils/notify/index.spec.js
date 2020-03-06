import { store } from 'react-notifications-component'
import NotifyMe from './index'

describe('notify', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls the success toast interface', () => {
    jest.spyOn(store, 'addNotification')
    NotifyMe.success({ id: '123', title: 'Voting', message: 'this is a vote' })
    expect(store.addNotification.mock.calls[0]).toMatchSnapshot()
  })

  it('calls the info toast interface', () => {
    jest.spyOn(store, 'addNotification')
    NotifyMe.info({ id: '123', title: 'Voting', message: 'this is a vote' })
    expect(store.addNotification.mock.calls[0]).toMatchSnapshot()
  })

  it('calls the warning toast interface', () => {
    jest.spyOn(store, 'addNotification')
    NotifyMe.warning({ id: '123', title: 'Voting', message: 'this is a vote' })
    expect(store.addNotification.mock.calls[0]).toMatchSnapshot()
  })
})
