// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

class Worker {
  constructor(stringUrl) {
    this.url = stringUrl
    this.onmessage = () => {}
    this.addEventListener = () => {}
  }

  postMessage(msg) {
    this.onmessage(msg)
  }
}
window.Worker = Worker

function noOp() {}

if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: noOp })
}

// Mock socket.io-client to prevent WebSocket connections in tests
jest.mock('socket.io-client', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn(),
    disconnect: jest.fn()
  }
  return jest.fn(() => mockSocket)
})

// Mock MessageChannel to prevent scheduler handle leaks
if (typeof MessageChannel === 'undefined') {
  global.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = { postMessage: jest.fn(), close: jest.fn() }
      this.port2 = { postMessage: jest.fn(), close: jest.fn() }
    }
  }
}

// Global test cleanup
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks()
})
