module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['test.ts', 'babel.config.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint', 'jest', 'prettier', 'react', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
    'jest/globals': true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // no semi colons please
    semi: ['error', 'never'],
    '@typescript-eslint/semi': ['error', 'never'],
    // fix the anonymous export warnings
    'import/no-anonymous-default-export': 'off',
    // remove when all anys have been fixed
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    // prettier integration
    'prettier/prettier': 'error',
    // React 17+ JSX transform doesn't require React in scope
    'react/react-in-jsx-scope': 'off',
    // TypeScript provides type checking, no need for prop-types
    'react/prop-types': 'off',
    // allow conditional expects in tests for error handling patterns
    'jest/no-conditional-expect': 'off',
    // React 18 migration is a larger task, disable deprecation warnings for now
    'react/no-deprecated': 'off',
    // allow unused variables that start with underscore
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ]
  }
}
