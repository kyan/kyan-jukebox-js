import mockingoose from 'mockingoose'
import model from './index'

describe('test mongoose User model', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it('should return the user with findById', () => {
    const _doc = {
      _id: '507f191e810c19729de860ea',
      fullname: 'name',
      username: 'username'
    }

    mockingoose.User.toReturn(_doc, 'findOne')

    return model
      .findById({ _id: '507f191e810c19729de860ea' })
      .then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc)
      })
  })
})
