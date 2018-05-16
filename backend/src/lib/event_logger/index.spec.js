import EventLogger from './index'
import Event from '../services/mongodb/models/event'

describe('EventLogger', () => {
  it('creates an event for a valid key', () => {
    spyOn(Event, 'create')
    EventLogger('123', 'mopidy::mixer.setVolume', {})
    expect(Event.create).toHaveBeenCalledWith({
      key: 'mopidy::mixer.setVolume',
      payload: {},
      user: '123'
    })
  })

  it('does not create an event for an invalid key', () => {
    spyOn(Event, 'create')
    EventLogger('123', 'mopidy::library.getImages')
    expect(Event.create).not.toHaveBeenCalled()
  })
})
