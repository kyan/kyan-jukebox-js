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

  describe('when show is false', () => {
    it('shows nothing', () => {
      wrapper = shallow(<VotedBy show={false} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when no votes are provided', () => {
    it('just shows a label with -3 vote', () => {
      wrapper = shallow(<VotedBy show total={21} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('just shows a label with 50 votes', () => {
      wrapper = shallow(<VotedBy show total={50} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('just shows a label with 100 votes', () => {
      wrapper = shallow(<VotedBy show total={100} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('just shows a label with 0 vote', () => {
      wrapper = shallow(<VotedBy show total={0} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when votes information is provided', () => {
    const votes = [vote1, vote2]

    describe('and no ribbon prop', () => {
      it('displays the correct information', () => {
        wrapper = shallow(<VotedBy show total={22} votes={votes} />)
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('and a ribbon prop is set', () => {
      it('displays the correct information', () => {
        wrapper = shallow(<VotedBy show total={11} votes={votes} ribbon />)
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
      wrapper = shallow(<VotedBy show total={10} votes={[vote]} />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
