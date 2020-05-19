module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
  ],
  testRegex: '/src/.*\\.(test|spec)?\\.(ts|tsx)$',
  testPathIgnorePatterns: ['/node_modules/', '/src/utils/*'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};