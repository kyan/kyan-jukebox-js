/**
 * TypeScript declarations for Testing Library matchers with Bun
 *
 * This file extends Bun's test types to include Testing Library's jest-dom matchers,
 * providing proper TypeScript support and autocompletion for DOM assertions.
 */

import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'bun:test' {
  interface Matchers<T> extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchers extends TestingLibraryMatchers {}
}
