import mockingoose from 'mockingoose'
import model from './index'

describe('test mongoose Track model', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it('should return the event with findById', () => {
    const _doc = {
      _id: '507f191e810c19729de860ea',
      trackUri: 'spotifyuri123456789',
      users: []
    }

    mockingoose.Track.toReturn(_doc, 'findOne')

    return model
      .findById({ _id: '507f191e810c19729de860ea' })
      .then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc)
      })
  })
})

