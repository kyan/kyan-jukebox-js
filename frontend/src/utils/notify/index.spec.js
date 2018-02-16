import Push from 'push.js'
import notify from './index'
jest.mock('push.js')

describe('notify', () => {
  it('calls the Push interface with opts', () => {
    notify('Message Title', { body: 'message body' })
    expect(Push.create.mock.calls.length).toEqual(1)
    expect(Push.create.mock.calls[0][0]).toEqual('Message Title')
    expect(Push.create.mock.calls[0][1]).toEqual({
      body: 'message body',
      icon: '/jukebox.png',
      silent: true
    })
    Push.create.mockClear()
  })

  it('calls the Push interface with no opts', () => {
    notify('Message Title 1')
    expect(Push.create.mock.calls.length).toEqual(1)
    expect(Push.create.mock.calls[0][0]).toEqual('Message Title 1')
  })
})
