/**
 * File: performance.config.js
 * Version: v1.0.0
 * Performance metrics configuration
 */

module.exports = {
  // Web Vitals thresholds (in milliseconds)
  webVitals: {
    lcp: 2500, // Largest Contentful Paint
    fid: 100,  // First Input Delay
    cls: 0.1,  // Cumulative Layout Shift
    tti: 3800, // Time to Interactive
    tbt: 300   // Total Blocking Time
  },
  // Build performance thresholds
  build: {
    bundleSize: 1024 * 1024, // 1MB
    chunkSize: 256 * 1024,   // 256KB
    gzipSize: 512 * 1024     // 512KB
  },
  // Runtime performance thresholds
  runtime: {
    fps: 60,
    memoryUsage: 500 * 1024 * 1024, // 500MB
    cpuUsage: 50 // 50%
  }
};