/**
 * 简单的日志工具
 * 在生产环境中禁用 debug 和 info 级别的日志
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// 根据环境设置最低日志级别
const MIN_LOG_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

class Logger {
  private minLevel: number;
  private logCount: number = 0;
  private readonly maxLogCount: number = 100;
  private isLogLimitReached: boolean = false;

  constructor() {
    this.minLevel = LOG_LEVELS[MIN_LOG_LEVEL];
  }

  private checkLogLimit(): boolean {
    if (this.logCount >= this.maxLogCount && !this.isLogLimitReached) {
      console.warn('[LOGGER] Log limit reached (100 logs). Further logs will be suppressed.');
      this.isLogLimitReached = true;
      return false;
    }
    return !this.isLogLimitReached;
  }

  debug(...args: any[]): void {
    if (LOG_LEVELS.debug >= this.minLevel && this.checkLogLimit()) {
      console.log('[DEBUG]', ...args);
      this.logCount++;
    }
  }

  info(...args: any[]): void {
    if (LOG_LEVELS.info >= this.minLevel && this.checkLogLimit()) {
      console.log('[INFO]', ...args);
      this.logCount++;
    }
  }

  warn(...args: any[]): void {
    if (LOG_LEVELS.warn >= this.minLevel && this.checkLogLimit()) {
      console.warn('[WARN]', ...args);
      this.logCount++;
    }
  }

  error(...args: any[]): void {
    if (LOG_LEVELS.error >= this.minLevel && this.checkLogLimit()) {
      console.error('[ERROR]', ...args);
      this.logCount++;
    }
  }

  // 分组日志
  group(label: string): void {
    if (LOG_LEVELS.debug >= this.minLevel && this.checkLogLimit()) {
      console.group(label);
      this.logCount++;
    }
  }

  groupEnd(): void {
    if (LOG_LEVELS.debug >= this.minLevel) {
      console.groupEnd();
    }
  }

  // 重置日志计数
  resetLogCount(): void {
    this.logCount = 0;
    this.isLogLimitReached = false;
    console.log('[LOGGER] Log count reset');
  }

  // 获取当前日志计数
  getLogCount(): number {
    return this.logCount;
  }
}

export const logger = new Logger();
export default logger;
