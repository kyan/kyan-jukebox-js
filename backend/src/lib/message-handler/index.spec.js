import MessageHandler from './index';

describe('MessageHandler', () => {
  let payload = {
    key: 'playback.stop',
    params: [['12345zsdf23456']]
  };
  const ws = 'websocket';
  const stopMock = params => {
    return {
      then: (cb) => {
        cb(params);
        return {
          catch: () => {
            return {
              done: jest.fn()
            }
          }
        }
      }
    }
  };
  const broadcastMock = jest.fn();
  const broadcasterMock = {
    to: broadcastMock
  };
  const mopidy = { playback: { stop: stopMock } };

  describe('when passed params', () => {
    it('calls the api successfully', () => {
      const handler = MessageHandler(
         JSON.stringify(payload), ws, broadcasterMock, mopidy);
      expect(broadcastMock.mock.calls.length).toEqual(1);
      expect(broadcastMock.mock.calls[0][0]).toEqual('websocket');
      expect(broadcastMock.mock.calls[0][1]).toEqual(payload.key);
      expect(broadcastMock.mock.calls[0][2]).toEqual(payload.params);
      broadcastMock.mockClear();
    });
  });

  describe('when passed no params', () => {
    it('calls the api successfully', () => {
      delete(payload.params);
      const handler = MessageHandler(
         JSON.stringify(payload), ws, broadcasterMock, mopidy);
      expect(broadcastMock.mock.calls.length).toEqual(1);
      expect(broadcastMock.mock.calls[0][0]).toEqual('websocket');
      expect(broadcastMock.mock.calls[0][1]).toEqual(payload.key);
      expect(broadcastMock.mock.calls[0][2]).toBeUndefined();
    });
  });
});
