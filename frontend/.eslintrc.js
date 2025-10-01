module.exports = {
  root: true,
  extends: ['react-app', 'react-app/jest'],
  env: {
    es6: true,
    browser: true,
    node: true
  },
  rules: {
    // no semi colons please
    semi: ['error', 'never'],
    // fix the anonymous export warnings
    'import/no-anonymous-default-export': 'off'
  }
}
