/**
 * File: vite.config.ts
 * Version: 1.8.92
 * Author: Sut
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  worker: {
    format: 'es'
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'esbuild'
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
})