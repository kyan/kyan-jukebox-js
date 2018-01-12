import TransformerTrack from './index';

describe('TransformerTrack', () => {
  let payload = {
    uri: 'uri',
    name: 'name',
    date: 'date',
    length: 'length',
    album: {
      uri: 'uri',
      name: 'name'
    },
    artists: [
      { uri: 'uri', name: 'name' },
      { uri: 'uri1', name: 'name1' }
    ]
  };

  describe('when passed the full track', () => {
    it('transforms the track', () => {
      expect(TransformerTrack(payload)).toEqual({
        track: {
          uri: 'uri',
          name: 'name',
          year: 'date',
          length: 'length',
          album: {
            uri: 'uri',
            name: 'name'
          },
          artist: {
            uri: 'uri',
            name: 'name'
          }
        }
      });
    });
  });

  describe('when passed the partial track', () => {
    beforeEach(() => {
      payload.artists = [];
    });

    it('transforms the track', () => {
      expect(TransformerTrack(payload)).toEqual({
        track: {
          uri: 'uri',
          name: 'name',
          year: 'date',
          length: 'length',
          album: {
            uri: 'uri',
            name: 'name'
          }
        }
      });
    });
  });
});
