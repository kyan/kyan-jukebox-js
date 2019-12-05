import EventLogger from './index'
import MopidyConsts from 'constants/mopidy'
import Event from 'services/mongodb/models/event'
import logger from 'config/winston'
jest.mock('config/winston')

describe('EventLogger', () => {
  afterEach(() => {
    logger.info.mockClear()
  })

  it('creates an event for a valid key', () => {
    spyOn(Event, 'create')
    EventLogger(
      { encoded_key: 'mopidy::mixer.setVolume', jwt_token: '123', user: { _id: 321 } },
      'request',
      'response'
    )
    expect(Event.create).toHaveBeenCalledWith({
      key: 'mopidy::mixer.setVolume',
      payload: {
        request: 'request',
        response: 'response'
      },
      user: 321
    })
    expect(logger.info.mock.calls[0][0]).toEqual('Event')
  })

  it('creates an event with a custom label', () => {
    spyOn(Event, 'create')
    EventLogger(
      { encoded_key: 'mopidy::mixer.setVolume', jwt_token: '123', user: { _id: 321 } },
      'request',
      'response',
      'MyLabel'
    )
    expect(logger.info.mock.calls[0][0]).toEqual('MyLabel')
  })

  it('does not create an event MopidyConsts.LIBRARY_GET_IMAGES', () => {
    spyOn(Event, 'create')
    EventLogger(
      { encoded_key: MopidyConsts.LIBRARY_GET_IMAGES },
      'request',
      'response',
      'MyLabel'
    )
    expect(Event.create).not.toHaveBeenCalled()
  })

  it('does not create an event MopidyConsts.PLAYBACK_GET_TIME_POSITION', () => {
    spyOn(Event, 'create')
    EventLogger(
      { encoded_key: MopidyConsts.PLAYBACK_GET_TIME_POSITION },
      'request',
      'response',
      'MyLabel'
    )
    expect(Event.create).not.toHaveBeenCalled()
  })

  it('does not create an event MopidyConsts.PLAYBACK_GET_STATE', () => {
    spyOn(Event, 'create')
    EventLogger(
      { encoded_key: MopidyConsts.PLAYBACK_GET_STATE },
      'request',
      'response',
      'MyLabel'
    )
    expect(Event.create).not.toHaveBeenCalled()
  })

  it('does not create an event MopidyConsts.MIXER_GET_VOLUME', () => {
    spyOn(Event, 'create')
    EventLogger(
      { encoded_key: MopidyConsts.MIXER_GET_VOLUME },
      'request',
      'response',
      'MyLabel'
    )
    expect(Event.create).not.toHaveBeenCalled()
  })
})
