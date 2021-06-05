module.exports = {
  env: {
    browser: true,
    node: true,
  },
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
    'eslint-plugin-react',
    'jsdoc',
    'prettier',
    'react-hooks',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // prettier rules
    'prettier/prettier': 'error',
    // @typescript-eslint rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit',
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        path: 'always',
        types: 'prefer-import',
        lib: 'always',
      },
    ],
    // eslint-plugin-react, react-hooks rules
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // eslint common rules
    'arrow-parens': ['error', 'always'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        functions: 'never',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
      },
    ],
    complexity: [
      'error',
      {
        max: 5,
      },
    ],
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'error',
    'id-denylist': [
      'error',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined',
    ],
    'import/no-deprecated': 'warn',
    'import/order': 'error',
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-indentation': 'error',
    'jsdoc/newline-after-description': 'error',
    'jsdoc/no-types': 'error',
    'max-len': [
      'warn',
      {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'newline-per-chained-call': 'off',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-eval': 'error',
    'no-invalid-this': 'error',
    'no-magic-numbers': [
      'error',
      {
        ignore: [0, 1, -1, 10],
      },
    ],
    'no-new-wrappers': 'error',
    'no-shadow': 'off',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'padded-blocks': [
      'off',
      {
        blocks: 'never',
      },
      {
        allowSingleLineBlocks: true,
      },
    ],
    'prefer-const': 'error',
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single'],
    radix: 'error',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-equals-spacing': 'off',
    'react/jsx-tag-spacing': [
      'off',
      {
        afterOpening: 'allow',
        closingSlash: 'allow',
      },
    ],
    'react/jsx-wrap-multilines': 'off',
    semi: 'off',
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/'],
      },
    ],
  },
};
