import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import preferArrow from 'eslint-plugin-prefer-arrow'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '**/*.d.ts', '**/coverage'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      jsxA11y.configs.strict,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
      'unused-imports': unusedImports,
      'prefer-arrow': preferArrow,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        },
      },
    },
    rules: {
      // React Rules
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/require-render-return': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-sort-props': ['error', { callbacksLast: true, shorthandFirst: true }],
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': 'error',
      'react/self-closing-comp': 'error',

      // TypeScript Rules - Enforcing Best Practices
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off', // Handled by unused-imports
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Naming Conventions - Enforcing Best Practices
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'], // PascalCase for React components
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
      ],

      // Import/Export Rules - Enforcing Import Organization
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@shared/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'off',

      // Unused Imports - Clean Code
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // General Code Quality Rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],

      // Arrow Functions - Enforcing Modern JavaScript
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'avoid'],

      // File Naming and Component Structure (Custom Rules)
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.tsx'] },
      ],

      // Performance Rules
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',

      // Accessibility Rules (from jsx-a11y)
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/media-has-caption': 'error',
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
    },
  },
)