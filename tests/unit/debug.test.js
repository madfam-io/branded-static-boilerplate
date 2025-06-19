/**
 * Debug Utility Tests
 * ===================
 * 
 * Tests for the debug logging utility
 */

// Mock window.location
const mockLocation = {
  hostname: 'localhost',
  protocol: 'http:'
};

// Mock process.env
const mockProcess = {
  env: {
    NODE_ENV: 'development'
  }
};

// Store original values
const originalLocation = window.location;
const originalProcess = global.process;

describe('Debug Utility', () => {
  let debug;
  let consoleSpy;

  beforeEach(async () => {
    // Mock console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      info: jest.spyOn(console, 'info').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
      table: jest.spyOn(console, 'table').mockImplementation(() => {}),
      time: jest.spyOn(console, 'time').mockImplementation(() => {}),
      timeEnd: jest.spyOn(console, 'timeEnd').mockImplementation(() => {})
    };

    // Clear module cache
    jest.resetModules();
  });

  afterEach(() => {
    // Restore console methods
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  afterAll(() => {
    // Restore globals
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true
    });
    global.process = originalProcess;
  });

  describe('Development Environment', () => {
    beforeEach(async () => {
      // Mock development environment
      global.process = mockProcess;
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true
      });

      // Import debug after mocking
      const debugModule = await import('../../src/scripts/core/debug.js');
      debug = debugModule.debug;
    });

    test('should log messages in development', () => {
      debug.log('test message');
      expect(consoleSpy.log).toHaveBeenCalledWith('test message');
    });

    test('should log info messages', () => {
      debug.info('info message');
      expect(consoleSpy.info).toHaveBeenCalledWith('info message');
    });

    test('should log warning messages', () => {
      debug.warn('warning message');
      expect(consoleSpy.warn).toHaveBeenCalledWith('warning message');
    });

    test('should log error messages', () => {
      debug.error('error message');
      expect(consoleSpy.error).toHaveBeenCalledWith('error message');
    });

    test('should log table data', () => {
      const data = [{ name: 'test', value: 123 }];
      debug.table(data);
      expect(consoleSpy.table).toHaveBeenCalledWith(data);
    });

    test('should start timing operations', () => {
      debug.time('test-timer');
      expect(consoleSpy.time).toHaveBeenCalledWith('test-timer');
    });

    test('should end timing operations', () => {
      debug.timeEnd('test-timer');
      expect(consoleSpy.timeEnd).toHaveBeenCalledWith('test-timer');
    });

    test('should handle multiple arguments', () => {
      debug.log('message', 'arg2', 123);
      expect(consoleSpy.log).toHaveBeenCalledWith('message', 'arg2', 123);
    });
  });

  describe('Production Environment', () => {
    beforeEach(async () => {
      // Mock production environment
      global.process = { env: { NODE_ENV: 'production' } };
      Object.defineProperty(window, 'location', {
        value: { 
          hostname: 'example.github.io', 
          protocol: 'https:' 
        },
        writable: true
      });

      jest.resetModules();
      const debugModule = await import('../../src/scripts/core/debug.js');
      debug = debugModule.debug;
    });

    test('should not log messages in production', () => {
      debug.log('test message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    test('should not log info messages in production', () => {
      debug.info('info message');
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    test('should not log warning messages in production', () => {
      debug.warn('warning message');
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    test('should not log error messages in production', () => {
      debug.error('error message');
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    test('should not log table data in production', () => {
      debug.table([{ test: 'data' }]);
      expect(consoleSpy.table).not.toHaveBeenCalled();
    });

    test('should not start timers in production', () => {
      debug.time('test-timer');
      expect(consoleSpy.time).not.toHaveBeenCalled();
    });

    test('should not end timers in production', () => {
      debug.timeEnd('test-timer');
      expect(consoleSpy.timeEnd).not.toHaveBeenCalled();
    });
  });

  describe('Environment Detection', () => {
    test('should detect localhost as development', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost', protocol: 'http:' },
        writable: true
      });
      
      jest.resetModules();
      const debugModule = await import('../../src/scripts/core/debug.js');
      debug = debugModule.debug;
      
      debug.log('localhost test');
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    test('should detect 127.0.0.1 as development', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: '127.0.0.1', protocol: 'http:' },
        writable: true
      });
      
      jest.resetModules();
      const debugModule = await import('../../src/scripts/core/debug.js');
      debug = debugModule.debug;
      
      debug.log('127.0.0.1 test');
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    test('should detect file:// protocol as development', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: '', protocol: 'file:' },
        writable: true
      });
      
      jest.resetModules();
      const debugModule = await import('../../src/scripts/core/debug.js');
      debug = debugModule.debug;
      
      debug.log('file protocol test');
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    test('should detect github.io as production even with dev hostname', async () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'test.github.io', protocol: 'https:' },
        writable: true
      });
      
      jest.resetModules();
      const debugModule = await import('../../src/scripts/core/debug.js');
      debug = debugModule.debug;
      
      debug.log('github.io test');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('Module Exports', () => {
    test('should export debug object', async () => {
      const debugModule = await import('../../src/scripts/core/debug.js');
      expect(debugModule.debug).toBeDefined();
      expect(typeof debugModule.debug.log).toBe('function');
    });

    test('should export default debug object', async () => {
      const debugModule = await import('../../src/scripts/core/debug.js');
      expect(debugModule.default).toBeDefined();
      expect(debugModule.default).toBe(debugModule.debug);
    });

    test('should have all required methods', async () => {
      const debugModule = await import('../../src/scripts/core/debug.js');
      const debug = debugModule.debug;
      
      expect(typeof debug.log).toBe('function');
      expect(typeof debug.info).toBe('function');
      expect(typeof debug.warn).toBe('function');
      expect(typeof debug.error).toBe('function');
      expect(typeof debug.table).toBe('function');
      expect(typeof debug.time).toBe('function');
      expect(typeof debug.timeEnd).toBe('function');
    });
  });
});