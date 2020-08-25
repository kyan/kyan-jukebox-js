import mockingoose from 'mockingoose'
import model from '../../src/models/event'

describe('test mongoose Event model', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it('should return the event with findById', async () => {
    const _doc = {
      _id: '507f191e810c19729de860ea',
      key: 'mopidy::library.getTracks',
      payload: 'hello'
    }

    mockingoose.Event.toReturn(_doc, 'findOne')

    const doc = await model.findById({ _id: '507f191e810c19729de860ea' })
    expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc)
  })
})
