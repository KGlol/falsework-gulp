module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    camelcase: 1,
    'consistent-return': 'warn',
    'import/extensions': 'off',
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'import/no-named-as-default-member': 0,
    'import/no-extraneous-dependencies': 0,
    'linebreak-style': [
      0,
      'windows',
    ],
    'max-len': 0,
    'no-new': 0,
    'no-undef': 'warn',
    'no-param-reassign': 0,
    'no-unused-expressions': 0,
    'no-extra-boolean-cast': 'warn',
    'no-unused-vars': 1,
    'prefer-destructuring': 0,
    'prefer-promise-reject-errors': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
