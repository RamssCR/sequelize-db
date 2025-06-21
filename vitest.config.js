import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setupTest.js'],
    include: ['test/**/*.test.js'],
    threads: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'test/**',
        'src/configs/**',
        'src/routes/**',
        'src/models/**',
        'src/@types/**',
        'src/app.js',
        '**/*.config.js',
        'scripts/**',
      ]
    }
  }
})