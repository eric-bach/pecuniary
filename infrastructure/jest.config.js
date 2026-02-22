module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(@middy/core)/)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  modulePaths: ['<rootDir>/node_modules', '<rootDir>/../backend/test/appsync/node_modules'],
};
