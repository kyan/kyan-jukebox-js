import React from 'react'
import { shallow } from 'enzyme'
import VotedBy from './index'

const vote1 = {
  user: {
    _id: '123',
    fullname: 'Big Rainbowhead',
    picture: 'link/to/image'
  },
  at: '2019-12-17T13:11:37.316Z',
  vote: 22
}

const vote2 = {
  user: {
    _id: '999',
    fullname: 'Duncan',
    picture: 'link/to/duncan/image'
  },
  at: '2019-12-19T13:11:37.316Z',
  vote: 75
}

describe('VotedBy', () => {
  let wrapper

  describe('when no votes are provided', () => {
    it('does nothing', () => {
      wrapper = shallow(<VotedBy total={21} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when votes information is provided', () => {
    const votes = [vote1, vote2]

    describe('and no ribbon prop', () => {
      it('displays the correct information', () => {
        wrapper = shallow(<VotedBy total={22} votes={votes} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('and a ribbon prop is set', () => {
      it('displays the correct information', () => {
        wrapper = shallow(<VotedBy total={11} votes={votes} ribbon />)
        expect(wrapper.find('Popup')).toMatchSnapshot()
      })
    })
  })

  describe('when no user data', () => {
    it('does nothing', () => {
      const vote = {
        at: '2019-12-19T13:11:37.316Z',
        vote: 75
      }
      wrapper = shallow(<VotedBy total={10} votes={[vote]} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the vote count is 0', () => {
    it('does not show a label', () => {
      const votes = [
        { at: '2019-12-14T13:11:37.316Z', vote: 0 },
        { at: '2019-12-19T13:11:37.316Z', vote: 0 }
      ]
      wrapper = shallow(<VotedBy total={5} votes={votes} />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
