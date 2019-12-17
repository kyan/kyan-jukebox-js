import mockingoose from 'mockingoose'
import model from './index'

describe('test mongoose Track model', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it('should return the event with findById', () => {
    const _doc = {
      _id: '2xN54cw14BBwQVCzQS2izH',
      added_by: []
    }

    mockingoose.Track.toReturn(_doc, 'findOne')

    return model
      .findById({ _id: '2xN54cw14BBwQVCzQS2izH' })
      .then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc)
      })
  })
})
