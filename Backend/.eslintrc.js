module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'warn',
    'prefer-const': 'off',
    'no-var': 'off',
    'require-await': 'off'
  },
  ignorePatterns: [
    'node_modules/',
    'logs/',
    'uploads/',
    'coverage/',
    '*.min.js'
  ]
};