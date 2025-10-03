import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import path from 'path'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Common rules configuration that can be reused
const commonRules = {
  // ===== JAVASCRIPT/TYPESCRIPT CORE RULES =====
  'no-unused-vars': 'off',
  'no-undef': 'off',
  'prefer-const': 'error',
  'no-var': 'error',

  // Code Quality (Balanced)
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  curly: ['warn', 'all'],
  'brace-style': ['error', '1tbs', { allowSingleLine: true }],
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',
  'no-alert': 'error',
  'no-console': 'warn',
  'no-debugger': 'error',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-extra-boolean-cast': 'error',
  'no-extra-semi': 'error',
  'no-irregular-whitespace': 'error',
  'no-unreachable': 'error',
  'valid-typeof': 'error',

  // Modern JavaScript
  'prefer-arrow-callback': 'error',
  'prefer-template': 'error',
  'prefer-spread': 'error',
  'prefer-rest-params': 'error',
  'prefer-destructuring': [
    'error',
    {
      VariableDeclarator: { array: false, object: true },
      AssignmentExpression: { array: false, object: false },
    },
  ],
  'object-shorthand': 'error',
  'quote-props': ['error', 'as-needed'],

  // ===== TYPESCRIPT SPECIFIC RULES (Relaxed) =====
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    },
  ],
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-non-null-assertion': 'off', // Allow when necessary
  '@typescript-eslint/prefer-as-const': 'warn',
  '@typescript-eslint/prefer-nullish-coalescing': 'warn',
  '@typescript-eslint/prefer-optional-chain': 'warn',
  '@typescript-eslint/strict-boolean-expressions': 'off', // Too strict
  '@typescript-eslint/no-floating-promises': 'off', // Too strict for development
  '@typescript-eslint/no-misused-promises': 'off', // Allow async event handlers
  '@typescript-eslint/await-thenable': 'warn',
  '@typescript-eslint/require-await': 'off', // Can be overly restrictive
  '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
  '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
  '@typescript-eslint/consistent-type-imports': [
    'warn',
    {
      prefer: 'type-imports',
      fixStyle: 'separate-type-imports',
    },
  ],
  '@typescript-eslint/no-import-type-side-effects': 'warn',
  '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
  '@typescript-eslint/ban-ts-comment': [
    'warn',
    {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': 'allow-with-description',
      'ts-nocheck': false,
      'ts-check': false,
    },
  ],
  '@typescript-eslint/prefer-readonly': 'off', // Can be overly restrictive

  // Naming Conventions (Relaxed)
  '@typescript-eslint/naming-convention': [
    'warn',
    {
      selector: 'interface',
      format: ['PascalCase'],
      custom: {
        regex: '^I[A-Z]',
        match: false,
      },
    },
    {
      selector: 'class',
      format: ['PascalCase'],
    },
  ],

  // ===== REACT RULES (Balanced) =====
  'react/jsx-uses-react': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
  'react/display-name': 'error',
  'react/jsx-key': [
    'error',
    {
      checkFragmentShorthand: true,
      checkKeyMustBeforeSpread: true,
      warnOnDuplicates: true,
    },
  ],
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

  // React Best Practices (Balanced)
  'react/jsx-boolean-value': ['error', 'never'],
  'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  'react/jsx-fragments': ['error', 'syntax'],
  'react/jsx-no-leaked-render': 'warn',
  'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
  'react/jsx-pascal-case': 'error',
  'react/no-array-index-key': 'warn',
  'react/no-unstable-nested-components': 'error',
  'react/self-closing-comp': 'error',
  'react/jsx-sort-props': 'off',
  'react/function-component-definition': 'off',
  'react/hook-use-state': 'warn',
  'react/jsx-no-constructed-context-values': 'error',

  // React Hooks
  ...reactHooks.configs.recommended.rules,
  'react-hooks/exhaustive-deps': 'error',

  // React Refresh
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

  // ===== ACCESSIBILITY RULES (Essential) =====
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/anchor-has-content': 'error',
  'jsx-a11y/anchor-is-valid': 'error',
  'jsx-a11y/aria-props': 'error',
  'jsx-a11y/aria-proptypes': 'error',
  'jsx-a11y/aria-role': 'error',
  'jsx-a11y/aria-unsupported-elements': 'error',
  'jsx-a11y/click-events-have-key-events': 'warn',
  'jsx-a11y/heading-has-content': 'error',
  'jsx-a11y/interactive-supports-focus': 'error',
  'jsx-a11y/label-has-associated-control': 'error',
  'jsx-a11y/no-access-key': 'error',
  'jsx-a11y/no-autofocus': 'error',
  'jsx-a11y/no-distracting-elements': 'error',
  'jsx-a11y/role-has-required-aria-props': 'error',
  'jsx-a11y/role-supports-aria-props': 'error',
  'jsx-a11y/tabindex-no-positive': 'error',

  // ===== IMPORT/EXPORT RULES (Relaxed) =====
  'import/order': [
    'warn',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
      pathGroups: [
        {
          pattern: 'react',
          group: 'external',
          position: 'before',
        },
        {
          pattern: '@shared/**',
          group: 'internal',
          position: 'before',
        },
      ],
      pathGroupsExcludedImportTypes: ['react'],
      'newlines-between': 'never', // Less strict about spacing
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    },
  ],
  'import/first': 'warn',
  'import/newline-after-import': 'warn',
  'import/no-duplicates': 'warn',
  'import/no-cycle': 'warn',
  'import/no-self-import': 'warn',
  'import/no-useless-path-segments': 'warn',
  'import/no-unresolved': 'off', // Can be problematic with path mappings
  'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],

  // ===== UNUSED IMPORTS =====
  'unused-imports/no-unused-imports': 'off', // Too strict for development
  'unused-imports/no-unused-vars': 'off', // Too strict for development
}

// Common plugins configuration
const commonPlugins = {
  react,
  'react-hooks': reactHooks,
  'react-refresh': reactRefresh,
  'jsx-a11y': jsxA11y,
  import: importPlugin,
  'unused-imports': unusedImports,
}

// Common settings configuration
const commonSettings = {
  react: {
    version: 'detect',
  },
  'import/resolver': {
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
}

export default tseslint.config(
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Global configuration for all files
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Disable TypeScript project parsing for all TypeScript files globally
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: false, // Explicitly disable project parsing
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Basic TypeScript rules without type checking
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // TypeScript source files in shared package
  {
    files: ['packages/shared/src/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: './packages/shared/tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: commonPlugins,
    settings: {
      ...commonSettings,
      'import/resolver': {
        ...commonSettings['import/resolver'],
        typescript: {
          alwaysTryTypes: true,
          project: './packages/shared/tsconfig.json',
        },
      },
    },
    rules: {
      ...commonRules,
      // Override overly strict type-checked rules
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },

  // TypeScript source files in internal app
  {
    files: ['apps/corp-authsigner-ui-internal/src/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: './apps/corp-authsigner-ui-internal/tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: commonPlugins,
    settings: {
      ...commonSettings,
      'import/resolver': {
        ...commonSettings['import/resolver'],
        typescript: {
          alwaysTryTypes: true,
          project: './apps/corp-authsigner-ui-internal/tsconfig.json',
        },
      },
    },
    rules: {
      ...commonRules,
      // Override overly strict type-checked rules
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },

  // TypeScript source files in external app
  {
    files: ['apps/corp-authsigner-ui-external/src/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: './apps/corp-authsigner-ui-external/tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: commonPlugins,
    settings: {
      ...commonSettings,
      'import/resolver': {
        ...commonSettings['import/resolver'],
        typescript: {
          alwaysTryTypes: true,
          project: './apps/corp-authsigner-ui-external/tsconfig.json',
        },
      },
    },
    rules: {
      ...commonRules,
      // Override overly strict type-checked rules
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },

  // General configuration for all JS files
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    rules: {
      // Basic rules that don't require type information
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': 'warn',
    },
  },

  // Ignores
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.d.ts',
      '**/.next/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.vscode/**',
      '**/.husky/**',
      '**/generated/**',
    ],
  },

  // Test files
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  // Configuration files (JavaScript)
  {
    files: ['**/*.config.{js,mjs,cjs}', '**/eslint.config.{js,mjs,cjs}'],
    rules: {
      'no-console': 'off',
    },
  },

  // Configuration files (TypeScript) - Basic rules only
  {
    files: ['**/*.config.ts', '**/vite.config.ts', '**/vitest.config.ts', '**/vitest.setup.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Script files
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  }
)
