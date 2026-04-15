module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh', 'simple-import-sort', 'unused-imports'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    eqeqeq: ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effects: imports with no bindings that run code on import (e.g. 'import "./polyfill"').
          // \u0000 is the virtual module prefix used by bundlers for side-effect-only imports.
          ['^\\u0000'],
          // React
          ['^react', '^react-dom', '^react-router', '^react-i18next'],
          // MUI
          ['^@mui/'],
          // Som Energia
          ['^@somenergia/'],
          // External: any other third-party package (scoped or not) installed from the registry.
          ['^@?\\w'],
          // Internals: relative imports that belong to this project (parent dirs, siblings, or index files).
          ['^\\.\\./', '^\\./', '^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    // Disabled because eslint-plugin-unused-imports provides its own no-unused-vars rule below.
    // Keeping both active would report duplicate errors for the same problem.
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
