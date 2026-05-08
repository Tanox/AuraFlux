// src/utils/logger.ts v2.3.10

interface LogEntry {
  level: LogLevel;
  timestamp: Date;
  args: any[];
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const ENV = process.env.NODE_ENV || 'development';
const MIN_LOG_LEVEL: LogLevel = ENV === 'production' ? 'warn' : 'debug';
const MAX_LOG_ENTRIES = ENV === 'production' ? 100 : 500;
const LOG_TO_CONSOLE = ENV !== 'production' || process.env.ENABLE_LOGGING === 'true';

class Logger {
  private minLevel: number;
  private logEntries: LogEntry[] = [];
  private logCount: number = 0;
  private maxEntries: number;
  private logToConsole: boolean;

  constructor() {
    this.minLevel = LOG_LEVELS[MIN_LOG_LEVEL];
    this.maxEntries = MAX_LOG_ENTRIES;
    this.logToConsole = LOG_TO_CONSOLE;
  }

  private getTimestamp(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  }

  private log(level: LogLevel, ...args: any[]): void {
    const entry: LogEntry = {
      level,
      timestamp: new Date(),
      args,
    };

    this.logEntries.push(entry);
    if (this.logEntries.length > this.maxEntries) {
      this.logEntries.shift();
    }
    this.logCount++;

    if (this.logToConsole) {
      const timestamp = this.getTimestamp();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      
      switch (level) {
        case 'debug':
          console.log(prefix, ...args);
          break;
        case 'info':
          console.info(prefix, ...args);
          break;
        case 'warn':
          console.warn(prefix, ...args);
          break;
        case 'error':
          console.error(prefix, ...args);
          break;
      }
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

  group(label: string): void {
    if (this.logToConsole && LOG_LEVELS.debug >= this.minLevel) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.logToConsole && LOG_LEVELS.debug >= this.minLevel) {
      console.groupEnd();
    }
  }

  resetLogCount(): void {
    this.logCount = 0;
    this.logEntries = [];
  }

  getLogCount(): number {
    return this.logCount;
  }

  getLogEntries(): LogEntry[] {
    return [...this.logEntries];
  }

  getLogEntriesByLevel(level: LogLevel): LogEntry[] {
    return this.logEntries.filter(entry => entry.level === level);
  }
}

export const logger = new Logger();
export default logger;
