import React from 'react'
import { shallow } from 'enzyme'
import AddedBy from './index'

const firstUser = {
  user: {
    _id: '123',
    fullname: 'Big Rainbowhead',
    picture: 'link/to/image'
  },
  addedAt: '2019-12-17T13:11:37.316Z',
  playedAt: '2019-12-17T13:11:37.316Z'
}
const secondUser = {
  user: {
    _id: '456',
    fullname: 'Big Rainbowhead2'
  },
  addedAt: '2019-12-17T13:11:37.316Z',
  playedAt: null
}
const thirdUser = {
  addedAt: '2019-12-17T13:11:37.316Z',
  playedAt: null
}

describe('AddedBy', () => {
  let wrapper

  describe('when no addedBy information provided', () => {
    it('displays a spotify icon', () => {
      wrapper = shallow(<AddedBy />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when addedBy information provided', () => {
    describe('and it is the first play', () => {
      it('displays a current user icon with a popup message', () => {
        wrapper = shallow(<AddedBy users={[firstUser]} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('and there is play history', () => {
      it('displays a current user icon with a popup message containing previous ', () => {
        wrapper = shallow(<AddedBy users={[firstUser, secondUser, thirdUser]} />)
        expect(wrapper).toMatchSnapshot()
      })
    })
  })
})
