/**
 * 绠€鍗曠殑鏃ュ織宸ュ叿
 * 鍦ㄧ敓浜х幆澧冧腑绂佺敤 debug 鍜?info 绾у埆鐨勬棩蹇?
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// 鏍规嵁鐜璁剧疆鏈€浣庢棩蹇楃骇鍒?
const MIN_LOG_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

class Logger {
  private minLevel: number;

  constructor() {
    this.minLevel = LOG_LEVELS[MIN_LOG_LEVEL];
  }

  debug(...args: any[]): void {
    if (LOG_LEVELS.debug >= this.minLevel) {
      console.log('[DEBUG]', ...args);
    }
  }

  info(...args: any[]): void {
    if (LOG_LEVELS.info >= this.minLevel) {
      console.log('[INFO]', ...args);
    }
  }

  warn(...args: any[]): void {
    if (LOG_LEVELS.warn >= this.minLevel) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: any[]): void {
    if (LOG_LEVELS.error >= this.minLevel) {
      console.error('[ERROR]', ...args);
    }
  }

  // 鍒嗙粍鏃ュ織
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
}

export const logger = new Logger();
export default logger;
