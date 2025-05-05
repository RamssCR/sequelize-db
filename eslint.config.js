import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import node from 'eslint-plugin-node'
import promise from 'eslint-plugin-promise'

/** @type {import("eslint").Linter[]} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
      env: {
        node: true,
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      node,
      promise,
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',

      // TypeScript-specific
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Import sorting
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    rules: prettier.rules,
  },
]
