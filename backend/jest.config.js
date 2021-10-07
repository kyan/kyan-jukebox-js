module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/test/**/*.test.(ts)'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  testEnvironment: 'node',
  clearMocks: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  collectCoverageFrom: [
    'src/**/*.(js|ts)',
    '!<rootDir>/dist/',
    '!src/index.ts',
    '!src/app.ts',
    '!src/constants/*',
    '!src/types/*.d.ts',
    '!src/config/*.ts'
  ]
}
