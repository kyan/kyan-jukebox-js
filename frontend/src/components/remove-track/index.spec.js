import React from 'react'
import { shallow } from 'enzyme'
import { Comment, Confirm } from 'semantic-ui-react'
import RemoveTrack from './index'

describe('RemoveTrack', () => {
  const onClickMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    const wrapper = shallow(
      <RemoveTrack
        uri='uri123'
        name='The track title'
        onClick={onClickMock}
      />
    )

    it('renders the as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })

    describe('confirm dialog', () => {
      it('is not shown default', () => {
        expect(wrapper.find(Confirm).prop('open')).toEqual(false)
      })

      it('it shows when the button is pressed', () => {
        wrapper.find(Comment.Action).simulate('click')
        expect(wrapper.find(Confirm).prop('open')).toEqual(true)
      })
    })

    describe('callbacks', () => {
      it('calls the onConfirm callback', () => {
        wrapper.find(Comment.Action).simulate('click')
        expect(wrapper.find('Confirm').prop('open')).toEqual(true)
        wrapper.find(Confirm).prop('onConfirm')()
        expect(onClickMock).toHaveBeenCalled()
      })

      it('calls the onCancel callback', () => {
        wrapper.find(Comment.Action).simulate('click')
        wrapper.find(Confirm).prop('onCancel')()
        expect(wrapper.find('Confirm').prop('open')).toEqual(false)
      })
    })
  })
})
