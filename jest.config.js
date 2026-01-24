module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/app.js',
        '!src/models/index.js',
        '!src/repositories/index.js',
        '!src/config/**',
        '!src/scripts/**'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    verbose: true
};
