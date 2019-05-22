import { notify } from 'react-notify-toast'
import NotifyMe from './index'
jest.mock('react-notify-toast')

describe('notify', () => {
  it('calls the toast interface', () => {
    NotifyMe('Added Foo by Bar')
    expect(notify.show.mock.calls.length).toEqual(1)
    expect(notify.show.mock.calls[0]).toMatchSnapshot()
  })
})
