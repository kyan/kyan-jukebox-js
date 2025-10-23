import '@testing-library/jest-dom'

declare module 'bun:test' {
  interface Matchers<T = any> {
    toBeInTheDocument(): T
    toBeVisible(): T
    toBeEmpty(): T
    toBeDisabled(): T
    toBeEnabled(): T
    toBeInvalid(): T
    toBeRequired(): T
    toBeValid(): T
    toContainElement(element: HTMLElement | SVGElement | null): T
    toContainHTML(htmlText: string): T
    toHaveAccessibleDescription(expectedAccessibleDescription?: string | RegExp): T
    toHaveAccessibleName(expectedAccessibleName?: string | RegExp): T
    toHaveAttribute(attr: string, value?: string | RegExp): T
    toHaveClass(...classNames: string[]): T
    toHaveFocus(): T
    toHaveFormValues(expectedValues: Record<string, any>): T
    toHaveStyle(css: string | Record<string, any>): T
    toHaveTextContent(text: string | RegExp): T
    toHaveValue(value: string | string[] | number): T
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): T
    toBeChecked(): T
    toBePartiallyChecked(): T
    toHaveDescription(text?: string | RegExp): T
    toHaveErrorMessage(text?: string | RegExp): T
    toBeEmptyDOMElement(): T
    toBeInTheDOM(container?: HTMLElement | SVGElement): T
  }
}
