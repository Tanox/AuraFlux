// src/utils/tests/logger.test.ts v2.3.9
import { logger } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    logger.resetLogCount();
  });

  describe('log levels', () => {
    it('should log debug messages with timestamp', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.debug('Debug message');
      const callArgs = consoleSpy.mock.calls[0];
      expect(callArgs[0]).toMatch(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] \[DEBUG\]$/);
      expect(callArgs[1]).toBe('Debug message');
      consoleSpy.mockRestore();
    });

    it('should log info messages with timestamp', () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      logger.info('Info message');
      const callArgs = consoleSpy.mock.calls[0];
      expect(callArgs[0]).toMatch(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] \[INFO\]$/);
      expect(callArgs[1]).toBe('Info message');
      consoleSpy.mockRestore();
    });

    it('should log warn messages with timestamp', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      logger.warn('Warning message');
      const callArgs = consoleSpy.mock.calls[0];
      expect(callArgs[0]).toMatch(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] \[WARN\]$/);
      expect(callArgs[1]).toBe('Warning message');
      consoleSpy.mockRestore();
    });

    it('should log error messages with timestamp', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('Error message');
      const callArgs = consoleSpy.mock.calls[0];
      expect(callArgs[0]).toMatch(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] \[ERROR\]$/);
      expect(callArgs[1]).toBe('Error message');
      consoleSpy.mockRestore();
    });
  });

  describe('log count tracking', () => {
    it('should track log count', () => {
      logger.debug('Test 1');
      logger.debug('Test 2');
      expect(logger.getLogCount()).toBe(2);
    });

    it('should reset log count', () => {
      logger.debug('Test 1');
      logger.debug('Test 2');
      expect(logger.getLogCount()).toBe(2);

      logger.resetLogCount();
      expect(logger.getLogCount()).toBe(0);
    });
  });

  describe('log entries', () => {
    it('should store log entries', () => {
      logger.debug('Test entry');
      const entries = logger.getLogEntries();
      expect(entries.length).toBe(1);
      expect(entries[0].level).toBe('debug');
      expect(entries[0].args[0]).toBe('Test entry');
    });

    it('should filter entries by level', () => {
      logger.debug('Debug entry');
      logger.info('Info entry');
      logger.warn('Warn entry');
      
      const debugEntries = logger.getLogEntriesByLevel('debug');
      const infoEntries = logger.getLogEntriesByLevel('info');
      
      expect(debugEntries.length).toBe(1);
      expect(infoEntries.length).toBe(1);
      expect(debugEntries[0].args[0]).toBe('Debug entry');
    });
  });

  describe('log grouping', () => {
    it('should group logs', () => {
      const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
      logger.group('Test Group');
      expect(consoleGroupSpy).toHaveBeenCalledWith('Test Group');
      consoleGroupSpy.mockRestore();
    });

    it('should end log group', () => {
      const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();
      logger.groupEnd();
      expect(consoleGroupEndSpy).toHaveBeenCalled();
      consoleGroupEndSpy.mockRestore();
    });
  });
});
