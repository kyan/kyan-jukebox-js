import React from 'react'
import { shallow } from 'enzyme'
import VolumeButtons from './index'

describe('VolumeButtons', () => {
  const volMock = jest.fn()
  let wrapper

  describe('render', () => {
    wrapper = shallow(
      <VolumeButtons
        volume={44}
        onVolumeChange={volMock}
      />
    )

    it('renders the as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('handles a volume down click', () => {
      volMock.mockClear()
      wrapper.find('.jb-volume-down').simulate('click')
      expect(volMock.mock.calls[0][0]).toEqual(43)
    })

    it('handles a volume up click', () => {
      volMock.mockClear()
      wrapper.find('.jb-volume-up').simulate('click')
      expect(volMock.mock.calls[0][0]).toEqual(45)
    })

    it('handles a volume down click when min is reached', () => {
      volMock.mockClear()
      wrapper = shallow(
        <VolumeButtons
          volume={0}
          onVolumeChange={volMock}
        />
      )
      wrapper.find('.jb-volume-down').simulate('click')
      expect(volMock.mock.calls.length).toEqual(0)
    })

    it('handles a volume up click when max is reached', () => {
      volMock.mockClear()
      wrapper = shallow(
        <VolumeButtons
          volume={100}
          onVolumeChange={volMock}
        />
      )
      wrapper.find('.jb-volume-up').simulate('click')
      expect(volMock.mock.calls.length).toEqual(0)
    })
  })
})
