module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    extraFileExtensions: ['.svelte'],
  },
  plugins: ['@typescript-eslint', 'svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/typescript': true,
  },
  ignorePatterns: ['.eslintrc.js', 'rollup.config.js'],
  rules: {
    'import/order': [
      2,
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'svelte.*',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@+(components|interfaces|services|utils)/**',
            group: 'internal',
          },
          {
            pattern: '*.scss',
            group: 'index',
            patternOptions: { matchBase: true },
          },
        ],
        pathGroupsExcludedImportTypes: ['svelte'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    '@typescript-eslint/explicit-function-return-type': [1, {
      allowExpressions: true,
    }],
    '@typescript-eslint/lines-between-class-members': 0,
    '@typescript-eslint/no-use-before-define': 0,

    'class-methods-use-this': 0,
    'import/prefer-default-export': 0,
    'no-console': 1,
    'no-continue': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-useless-return': 1,
    'prettier/prettier': 0,
    semi: [2, 'always'],

    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': [2, {
      'some': ['nesting', 'id'],
      labelComponents: [],
      labelAttributes: [],
      controlComponents: [],
      depth: 25,
    }],
    'jsx-a11y/no-static-element-interactions': 0,

    // svelte only
    'import/no-mutable-exports': 0,
    'import/first': 0,
  },
};
