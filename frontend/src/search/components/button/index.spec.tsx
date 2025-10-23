import { describe, it, expect, beforeEach, mock } from 'bun:test'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SearchButton from './index'

describe('SearchButton', () => {
  let onClickMock: ReturnType<typeof mock>

  beforeEach(() => {
    onClickMock = mock(() => {}).mockName('onClickMock')
  })

  it('renders with button disabled', () => {
    const { container } = render(<SearchButton disabled onClick={onClickMock} />)

    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()

    // Check for the search icon
    const icon = container.querySelector('.search.icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders with button enabled', () => {
    const { container } = render(<SearchButton disabled={false} onClick={onClickMock} />)

    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()

    // Check for the search icon
    const icon = container.querySelector('.search.icon')
    expect(icon).toBeInTheDocument()
  })

  it('handles click events correctly when enabled', () => {
    const { container } = render(<SearchButton disabled={false} onClick={onClickMock} />)

    const button = container.querySelector('button')
    fireEvent.click(button!)

    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it('does not trigger click when disabled', () => {
    const { container } = render(<SearchButton disabled onClick={onClickMock} />)

    const button = container.querySelector('button')
    fireEvent.click(button!)

    expect(onClickMock).not.toHaveBeenCalled()
  })

  it('has animated vertical button styling', () => {
    const { container } = render(<SearchButton disabled={false} onClick={onClickMock} />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('animated')
    expect(button).toHaveClass('vertical')
  })

  it('module import - can import the SearchButton component without hanging', () => {
    expect(SearchButton).toBeDefined()
    expect(typeof SearchButton).toBe('function')
  })
})
