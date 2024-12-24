module.exports = {
  testEnvironment: 'node',
  roots: [
    '<rootDir>/test',
    '<rootDir>/src/appsync/test'
  ],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
