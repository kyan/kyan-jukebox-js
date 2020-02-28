import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { mount } from 'enzyme'
import VolumeButtons from './index'

describe('VolumeButtons', () => {
  const volMock = jest.fn()
  const mockStore = configureMockStore()
  const buildWrapper = (store, props) => (
    mount(
      <Provider store={store}>
        <VolumeButtons
          {...props}
          onVolumeChange={volMock}
        />
      </Provider>
    ).find('VolumeButtons')
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    it('render', () => {
      const store = mockStore({ jukebox: { volume: 0 } })
      const wrapper = buildWrapper(store, { disabled: false })
      expect(wrapper).toMatchSnapshot()
    })

    it('handles a volume down click', () => {
      const store = mockStore({ jukebox: { volume: 30 } })
      const wrapper = buildWrapper(store, { disabled: false })
      wrapper.find('VolumeDownButton').simulate('click')
      expect(volMock).toHaveBeenCalledWith(25)
    })

    it('handles a volume down click when min is reached', () => {
      const store = mockStore({ jukebox: { volume: 0 } })
      const wrapper = buildWrapper(store, { disabled: false })
      wrapper.find('VolumeDownButton').simulate('click')
      expect(volMock).not.toHaveBeenCalled()
    })

    it('handles a volume up click', () => {
      const store = mockStore({ jukebox: { volume: 30 } })
      const wrapper = buildWrapper(store, { disabled: false })
      wrapper.find('VolumeUpButton').simulate('click')
      expect(volMock).toHaveBeenCalledWith(35)
    })

    it('handles a volume up click when max is reached', () => {
      const store = mockStore({ jukebox: { volume: 100 } })
      const wrapper = buildWrapper(store, { disabled: false })
      wrapper.find('VolumeUpButton').simulate('click')
      expect(volMock).not.toHaveBeenCalled()
    })

    it('handles a button being disabled', () => {
      const store = mockStore({ jukebox: { volume: 32 } })
      const wrapper = buildWrapper(store, { disabled: true })
      wrapper.find('VolumeUpButton').simulate('click')
      expect(volMock).not.toHaveBeenCalled()
    })
  })
})
