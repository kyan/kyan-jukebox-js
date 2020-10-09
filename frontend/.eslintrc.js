const defaultRules = [
  'react-app',
  'eslint:recommended',
  'plugin:prettier/recommended'
];

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: defaultRules,
  env: {
    es6: true,
    browser: true,
    node: true,
    'jest/globals': true
  },
  rules: {
    // no semi colons please
    semi: ['error', 'never']
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ["*.ts", "*.tsx"],
      plugins: ['@typescript-eslint'],
      extends: [
        ...defaultRules,
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'prettier/@typescript-eslint'
      ],
      rules: {
        // remove when all have been fixed
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off'
      }
    }
  ]
}
