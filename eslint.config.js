module.exports = {
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: {
    prettier: require('eslint-plugin-prettier'),
  },
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
};
