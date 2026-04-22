/**
 * 简单的日志工具
 * 在生产环境中禁用 debug 和 info 级别的日志
 * 限制日志数量为5条
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

// 最大日志数量限制
const MAX_LOGS = 5;

class Logger {
  private minLevel: number;
  private logCount: number = 0;

  constructor() {
    this.minLevel = LOG_LEVELS[MIN_LOG_LEVEL];
  }

  private log(level: LogLevel, ...args: any[]): void {
    if (this.logCount >= MAX_LOGS) {
      if (this.logCount === MAX_LOGS) {
        console.warn('[WARN] 日志数量已达到上限，将停止记录');
        this.logCount++;
      }
      return;
    }

    this.logCount++;
    
    switch (level) {
      case 'debug':
        console.log('[DEBUG]', ...args);
        break;
      case 'info':
        console.log('[INFO]', ...args);
        break;
      case 'warn':
        console.warn('[WARN]', ...args);
        break;
      case 'error':
        console.error('[ERROR]', ...args);
        break;
    }
  }

  debug(...args: any[]): void {
    if (LOG_LEVELS.debug >= this.minLevel) {
      this.log('debug', ...args);
    }
  }

  info(...args: any[]): void {
    if (LOG_LEVELS.info >= this.minLevel) {
      this.log('info', ...args);
    }
  }

  warn(...args: any[]): void {
    if (LOG_LEVELS.warn >= this.minLevel) {
      this.log('warn', ...args);
    }
  }

  error(...args: any[]): void {
    if (LOG_LEVELS.error >= this.minLevel) {
      this.log('error', ...args);
    }
  }

  // 分组日志
  group(label: string): void {
    if (LOG_LEVELS.debug >= this.minLevel) {
      console.group(label);
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
  }

  // 获取当前日志计数
  getLogCount(): number {
    return this.logCount;
  }
}

export const logger = new Logger();
export default logger;
