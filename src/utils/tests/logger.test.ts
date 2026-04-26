// File: src\utils\tests\logger.test.ts | Version: v2.3.8
import { logger } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    logger.resetLogCount();
  });

  describe('log levels', () => {
    it('should log debug messages', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.debug('Debug message');
      expect(consoleSpy).toHaveBeenCalledWith('[DEBUG]', 'Debug message');
      consoleSpy.mockRestore();
    });

    it('should log info messages', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('Info message');
      expect(consoleSpy).toHaveBeenCalledWith('[INFO]', 'Info message');
      consoleSpy.mockRestore();
    });

    it('should log warn messages', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      logger.warn('Warning message');
      expect(consoleSpy).toHaveBeenCalledWith('[WARN]', 'Warning message');
      consoleSpy.mockRestore();
    });

    it('should log error messages', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('Error message');
      expect(consoleSpy).toHaveBeenCalledWith('[ERROR]', 'Error message');
      consoleSpy.mockRestore();
    });
  });

  describe('log count limiting', () => {
    it('should limit logs to MAX_LOGS (5)', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      for (let i = 0; i < 10; i++) {
        logger.debug(`Log ${i}`);
      }

      expect(logger.getLogCount()).toBe(6);
      expect(consoleSpy).toHaveBeenCalledTimes(5);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should reset log count', () => {
      logger.debug('Test 1');
      logger.debug('Test 2');
      expect(logger.getLogCount()).toBe(2);

      logger.resetLogCount();
      expect(logger.getLogCount()).toBe(0);
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
