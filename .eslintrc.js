module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'generator-star-spacing': 'off',
      'prettier/prettier': 'error'
    },
  };