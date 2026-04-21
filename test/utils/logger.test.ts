// File: test/utils/logger.test.ts

import { logger } from '@/utils/logger';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleGroup = jest.spyOn(console, 'group').mockImplementation();
const mockConsoleGroupEnd = jest.spyOn(console, 'groupEnd').mockImplementation();

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debug should log debug messages', () => {
    logger.debug('Debug message');
    expect(mockConsoleLog).toHaveBeenCalledWith('[DEBUG]', 'Debug message');
  });

  test('info should log info messages', () => {
    logger.info('Info message');
    expect(mockConsoleLog).toHaveBeenCalledWith('[INFO]', 'Info message');
  });

  test('warn should log warning messages', () => {
    logger.warn('Warning message');
    expect(mockConsoleWarn).toHaveBeenCalledWith('[WARN]', 'Warning message');
  });

  test('error should log error messages', () => {
    logger.error('Error message');
    expect(mockConsoleError).toHaveBeenCalledWith('[ERROR]', 'Error message');
  });

  test('group should create console group', () => {
    logger.group('Test Group');
    expect(mockConsoleGroup).toHaveBeenCalledWith('Test Group');
  });

  test('groupEnd should end console group', () => {
    logger.groupEnd();
    expect(mockConsoleGroupEnd).toHaveBeenCalled();
  });

  test('should handle multiple arguments', () => {
    logger.info('Message with', 'multiple', 'arguments');
    expect(mockConsoleLog).toHaveBeenCalledWith('[INFO]', 'Message with', 'multiple', 'arguments');
  });

  test('should handle objects and arrays', () => {
    const testObject = { key: 'value' };
    const testArray = [1, 2, 3];
    logger.debug('Object:', testObject, 'Array:', testArray);
    expect(mockConsoleLog).toHaveBeenCalledWith('[DEBUG]', 'Object:', testObject, 'Array:', testArray);
  });
});
