// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/app/$1',
    },
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
    },
    collectCoverageFrom: [
      'app/**/*.{js,jsx,ts,tsx}',
      '!app/**/*.d.ts',
      '!app/**/page.tsx', // Server components need different testing approach
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: [
      '<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}',
    ],
  }