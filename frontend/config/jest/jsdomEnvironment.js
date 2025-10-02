const { TestEnvironment } = require('jest-environment-jsdom');

class CustomJSDOMEnvironment extends TestEnvironment {
  constructor(...args) {
    super(...args);

    // Store references to timers and intervals for cleanup
    this.timers = new Set();
    this.intervals = new Set();
    this.sockets = new Set();
    this.eventListeners = new Set();
  }

  async setup() {
    await super.setup();

    // Override setTimeout to track timers
    const originalSetTimeout = this.global.setTimeout;
    this.global.setTimeout = (callback, delay, ...args) => {
      const id = originalSetTimeout(callback, delay, ...args);
      this.timers.add(id);
      return id;
    };

    // Override setInterval to track intervals
    const originalSetInterval = this.global.setInterval;
    this.global.setInterval = (callback, delay, ...args) => {
      const id = originalSetInterval(callback, delay, ...args);
      this.intervals.add(id);
      return id;
    };

    // Override clearTimeout to remove from tracking
    const originalClearTimeout = this.global.clearTimeout;
    this.global.clearTimeout = (id) => {
      this.timers.delete(id);
      return originalClearTimeout(id);
    };

    // Override clearInterval to remove from tracking
    const originalClearInterval = this.global.clearInterval;
    this.global.clearInterval = (id) => {
      this.intervals.delete(id);
      return originalClearInterval(id);
    };

    // Track event listeners
    const originalAddEventListener = this.global.document.addEventListener;
    this.global.document.addEventListener = (type, listener, options) => {
      this.eventListeners.add({ type, listener, options });
      return originalAddEventListener.call(this.global.document, type, listener, options);
    };

    // Mock WebSocket to prevent hanging connections
    this.global.WebSocket = class MockWebSocket {
      constructor(url) {
        this.url = url;
        this.readyState = 1; // OPEN
        this.onopen = null;
        this.onclose = null;
        this.onmessage = null;
        this.onerror = null;
      }

      send() {}
      close() {
        this.readyState = 3; // CLOSED
        if (this.onclose) this.onclose();
      }
      addEventListener() {}
      removeEventListener() {}
    };
  }

  async teardown() {
    // Clear all tracked timers
    this.timers.forEach(id => {
      try {
        this.global.clearTimeout(id);
      } catch (e) {
        // Timer might already be cleared
      }
    });

    // Clear all tracked intervals
    this.intervals.forEach(id => {
      try {
        this.global.clearInterval(id);
      } catch (e) {
        // Interval might already be cleared
      }
    });

    // Remove all tracked event listeners
    this.eventListeners.forEach(({ type, listener, options }) => {
      try {
        this.global.document.removeEventListener(type, listener, options);
      } catch (e) {
        // Listener might already be removed
      }
    });

    // Clear collections
    this.timers.clear();
    this.intervals.clear();
    this.sockets.clear();
    this.eventListeners.clear();

    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = CustomJSDOMEnvironment;
