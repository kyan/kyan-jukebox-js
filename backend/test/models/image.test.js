import mockingoose from 'mockingoose'
import model from '../../src/models/image'

describe('test mongoose Image model', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it('should return the image with findById', () => {
    const _doc = {
      _id: 'spotify507f191e810c19729de860ea',
      url: 'url/to/image'
    }

    mockingoose.Image.toReturn(_doc, 'findOne')

    return model.findById({ _id: 'spotify507f191e810c19729de860ea' }).then((doc) => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc)
    })
  })
})
