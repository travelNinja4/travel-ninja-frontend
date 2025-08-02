/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import nextJest from 'next/jest';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Your custom Jest config
const customJestConfig: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '\\.(scss|sass|css)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default createJestConfig(customJestConfig);
