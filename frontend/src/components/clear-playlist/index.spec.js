import React from 'react'
import { shallow } from 'enzyme'
import { Confirm } from 'semantic-ui-react'
import ClearPlaylist from './index'

describe('ClearPlaylist', () => {
  const onClearMock = jest.fn()
  let wrapper

  describe('render', () => {
    wrapper = shallow(
      <ClearPlaylist
        onClear={onClearMock}
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
        wrapper.find('.jb-clear-button').simulate('click')
        expect(wrapper.find(Confirm).prop('open')).toEqual(true)
      })
    })

    describe('callbacks', () => {
      it('calls the onConfirm callback', () => {
        wrapper.find('.jb-clear-button').simulate('click')
        expect(wrapper.instance().state.open).toEqual(true)
        wrapper.find(Confirm).prop('onConfirm')()
        expect(onClearMock.mock.calls.length).toEqual(1)
      })

      it('calls the onCancel callback', () => {
        wrapper.find('.jb-clear-button').simulate('click')
        wrapper.find(Confirm).prop('onCancel')()
        expect(wrapper.instance().state.open).toEqual(false)
      })
    })
  })
})
