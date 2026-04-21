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
    // 重置日志计数
    (logger as any).resetLogCount();
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

  test('should limit logs to 100', () => {
    // 记录101条日志
    for (let i = 0; i < 101; i++) {
      logger.debug(`Log ${i}`);
    }
    
    // 验证前100条日志被记录
    expect(mockConsoleLog).toHaveBeenCalledTimes(101); // 1条重置日志 + 100条调试日志
    
    // 验证第101条日志被抑制，并且显示了日志限制警告
    expect(mockConsoleWarn).toHaveBeenCalledWith('[LOGGER] Log limit reached (100 logs). Further logs will be suppressed.');
  });

  test('resetLogCount should reset log counter', () => {
    // 记录一些日志
    logger.debug('Test log');
    expect((logger as any).getLogCount()).toBe(1);
    
    // 重置日志计数
    (logger as any).resetLogCount();
    expect((logger as any).getLogCount()).toBe(0);
  });

  test('getLogCount should return current log count', () => {
    // 记录一些日志
    logger.debug('Test log 1');
    logger.info('Test log 2');
    logger.warn('Test log 3');
    
    expect((logger as any).getLogCount()).toBe(3);
  });
});
