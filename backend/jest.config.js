module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js', // Excluir el archivo principal del servidor
    '!src/config/database.js', // Excluir configuración de DB
    '!src/routes/**' // Excluir configuración de DB
  ],
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  clearMocks: true,
};