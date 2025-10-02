module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    es6: true,
    node: true,
    'jest/globals': true
  },
  rules: {
    // no semi colons please
    semi: ['error', 'never'],
    '@typescript-eslint/semi': ['error', 'never'],
    // remove when all anys have been fixed
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    // prettier integration
    'prettier/prettier': 'error',
    // allow conditional expects in tests for error handling patterns
    'jest/no-conditional-expect': 'off'
  }
}
