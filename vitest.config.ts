import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      include: ['packages/react-qr-code/src'],
      exclude: ['packages/react-qr-code/src/index.ts', 'packages/react-qr-code/src/lib'],
    },
  },
})
