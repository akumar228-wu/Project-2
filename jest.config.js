// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
      'routes/**/*.js',
      'models/**/*.js',
      'app.js',
      '!**/node_modules/**'
    ],
    setupFilesAfterEnv: ['./__tests__/setup.js']
  };