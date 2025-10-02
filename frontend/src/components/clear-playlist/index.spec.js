import React from 'react'
import { shallow } from 'enzyme'
import { Confirm } from 'semantic-ui-react'
import ClearPlaylist from './index'

describe('ClearPlaylist', () => {
  const onClearMock = jest.fn()

  describe('render', () => {
    const wrapper = shallow(<ClearPlaylist onClear={onClearMock} />)

    it('renders the as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })

    describe('confirm dialog', () => {
      it('is not shown default', () => {
        expect(wrapper.find(Confirm).prop('open')).toEqual(false)
      })

      it('shows when the button is pressed', () => {
        wrapper.find('Label').simulate('click')
        expect(wrapper.find(Confirm).prop('open')).toEqual(true)
      })
    })

    describe('callbacks', () => {
      it('calls the onConfirm callback', () => {
        wrapper.find('Label').simulate('click')
        expect(wrapper.find('Confirm').prop('open')).toEqual(true)
        wrapper.find(Confirm).prop('onConfirm')()
        expect(onClearMock).toHaveBeenCalled()
      })

      it('calls the onCancel callback', () => {
        wrapper.find('Label').simulate('click')
        wrapper.find(Confirm).prop('onCancel')()
        expect(wrapper.find('Confirm').prop('open')).toEqual(false)
      })
    })
  })

  describe('when disabled', () => {
    const wrapper = shallow(<ClearPlaylist onClear={onClearMock} disabled />)

    it('renders the as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
