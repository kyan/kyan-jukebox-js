import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SearchButton from './index'

describe('SearchButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    const onClickMock = jest.fn().mockName('onClickMock')

    test('with button disabled', () => {
      const { asFragment } = render(<SearchButton disabled onClick={onClickMock} />)
      expect(asFragment().firstChild).toMatchSnapshot()
    })

    test('with button enabled', () => {
      const { asFragment } = render(<SearchButton disabled={false} onClick={onClickMock} />)
      expect(asFragment().firstChild).toMatchSnapshot()
    })

    test('with valid props it renders correctly', () => {
      const { getByText } = render(<SearchButton disabled={false} onClick={onClickMock} />)
      fireEvent.click(getByText('Search'))
      expect(onClickMock).toHaveBeenCalledTimes(1)
    })
  })
})
