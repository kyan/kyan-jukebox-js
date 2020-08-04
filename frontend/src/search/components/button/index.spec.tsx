import React from 'react'
import { mount } from 'enzyme'
import SearchButton from './index'

describe('SearchButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    const onClickMock = jest.fn().mockName('onClickMock')

    test('with button disabled', () => {
      const wrapper = mount(<SearchButton disabled onClick={onClickMock} />)

      expect(wrapper).toMatchSnapshot()
    })

    test('with button enabled', () => {
      const wrapper = mount(<SearchButton disabled={false} onClick={onClickMock} />)

      expect(wrapper).toMatchSnapshot()
    })

    test('with valid props it renders correctly', () => {
      const wrapper = mount(<SearchButton disabled={false} onClick={onClickMock} />)
      wrapper.find('Button').simulate('click')
      expect(onClickMock).toHaveBeenCalled()
    })
  })
})
