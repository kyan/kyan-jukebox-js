import { notify } from 'react-notify-toast'
import NotifyMe from './index'
jest.mock('react-notify-toast')

describe('notify', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls the success toast interface', () => {
    NotifyMe.success('A message')
    expect(notify.show.mock.calls.length).toEqual(1)
    expect(notify.show.mock.calls[0]).toMatchSnapshot()
  })

  it('calls the warning toast interface', () => {
    NotifyMe.warning('A message')
    expect(notify.show.mock.calls.length).toEqual(1)
    expect(notify.show.mock.calls[0]).toMatchSnapshot()
  })
})
