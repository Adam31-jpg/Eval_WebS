// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js', '<rootDir>/test/cleanup.js'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/src/**/*.js'],
  // Si vous souhaitez ignorer certains dossiers:
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  maxWorkers: 1,
};
