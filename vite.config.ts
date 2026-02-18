// File: vite.config.ts | Version: v1.9.72
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app')
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