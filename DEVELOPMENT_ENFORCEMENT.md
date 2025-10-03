# Development Best Practices Enforcement

This document explains how the development best practices are automatically enforced in this repository and what developers can expect when working with the codebase.

## 🚀 Automated Enforcement Overview

Our development workflow includes multiple layers of enforcement to ensure code quality and consistency:

1. **Real-time IDE Integration** (VSCode)
2. **Pre-commit Hooks** (Husky)
3. **Continuous Integration** (CI Pipeline)
4. **Manual Validation Scripts**

## 🔧 Enforcement Mechanisms

### 1. ESLint Configuration (Strict Mode)

**Location**: `eslint.config.js`

Our ESLint configuration enforces:

#### Naming Conventions

```typescript
// ✅ Correct
const userProfile = 'data' // camelCase variables
const MAX_RETRIES = 3 // UPPER_CASE constants
interface UserProfile {} // PascalCase interfaces
enum UserRole {} // PascalCase enums
const UserComponent = () => {} // PascalCase components

// ❌ Will cause errors
const user_profile = 'data' // snake_case not allowed
const maxRetries = 3 // constants should be UPPER_CASE
interface IUserProfile {} // Hungarian notation not allowed
```

#### TypeScript Strict Rules

- `@typescript-eslint/no-explicit-any`: Prevents `any` type usage
- `@typescript-eslint/strict-boolean-expressions`: Enforces explicit boolean checks
- `@typescript-eslint/no-floating-promises`: Requires Promise handling
- `@typescript-eslint/consistent-type-imports`: Enforces type-only imports

#### React Best Practices

- `react/jsx-key`: Requires key props in lists
- `react/no-array-index-key`: Warns against using array indices as keys
- `react/jsx-pascal-case`: Enforces PascalCase for components
- `react-hooks/exhaustive-deps`: Enforces complete dependency arrays

#### Import Organization

- Automatic import sorting by groups:
  1. React imports
  2. Next.js imports (if applicable)
  3. Third-party libraries
  4. Shared packages (`@shared/*`)
  5. Internal imports (`@/*`)
  6. Relative imports

### 2. TypeScript Strict Configuration

**Location**: `tsconfig.json`

Enhanced TypeScript settings include:

- `strictNullChecks`: Prevents null/undefined errors
- `noUncheckedIndexedAccess`: Requires index checking
- `exactOptionalPropertyTypes`: Strict optional property handling
- `noUnusedLocals` & `noUnusedParameters`: Removes dead code

### 3. File Structure Validation

**Script**: `scripts/validate-file-structure.js`

Automatically validates:

#### File Naming

```bash
# ✅ Correct naming
UserProfile.tsx           # PascalCase components
userService.ts            # camelCase utilities
user-profile/             # kebab-case directories
package.json              # lowercase config files

# ❌ Will cause errors
userProfile.tsx           # Components must be PascalCase
UserService.ts            # Utilities should be camelCase
userProfile/              # Directories should be kebab-case
```

#### Directory Structure

```
src/
├── components/           # ✅ Components in components folder
├── utils/               # ✅ Utilities in utils folder
├── types/               # ✅ Types in types folder
└── services/            # ✅ Services in services folder
```

### 4. Component Structure Validation

**Script**: `scripts/validate-component-structure.js`

Enforces React component best practices:

#### Required Structure

```typescript
// ✅ Correct component structure
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export const Button = ({ children, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}
```

#### Common Violations Detected

- Missing TypeScript interfaces for props
- Missing key props in lists
- Console statements (warns for removal)
- Missing alt attributes on images
- Direct state mutation
- Incomplete useEffect dependencies

### 5. Pre-commit Hooks

**Location**: `.husky/pre-commit`

Before each commit, the following checks run automatically:

```bash
🚀 Running pre-commit checks...
📋 Running lint-staged...          # Fixes staged files
🔍 Running structure validation... # Validates file naming
⚛️  Running component validation... # Validates React patterns
📝 Running TypeScript checks...    # Type checking
🔧 Running ESLint...              # Linting with strict rules
🧪 Running tests...               # Test suite
✅ All pre-commit checks passed!
```

**If any check fails, the commit is blocked.**

### 6. Commit Message Validation

**Location**: `.husky/commit-msg`

Enforces conventional commit format:

```bash
# ✅ Valid formats
feat(auth): add user login functionality
fix(button): resolve disabled state styling
docs(readme): update installation instructions
refactor(utils): improve error handling

# ❌ Invalid formats
Add login feature                 # Missing type and scope
fixed a bug                      # Incorrect format
FEAT: add feature               # Wrong case
```

## 📋 Available Commands

### Validation Commands

```bash
# Run all validations
npm run validate:all

# Run file structure validation
npm run validate:structure

# Run component structure validation
npm run validate:components

# Run comprehensive checks
npm run check-all
```

### Fixing Commands

```bash
# Auto-fix linting issues
npm run lint:fix

# Auto-format code
npm run format

# Fix all auto-fixable issues
npm run fix-all
```

### Development Commands

```bash
# Run with validation on save
npm run dev:internal
npm run dev:external

# Build with full validation
npm run build:all
```

## 🚨 What Happens When Rules Are Violated

### During Development (IDE)

- **Red underlines** for errors
- **Yellow underlines** for warnings
- **Auto-fix suggestions** on save
- **Import organization** on save

### During Commit

1. **Lint-staged** runs and tries to auto-fix issues
2. **Structure validation** checks file/directory naming
3. **Component validation** checks React patterns
4. **TypeScript compilation** checks types
5. **ESLint** runs with strict rules
6. **Tests** must pass

**If any step fails:**

- Commit is **blocked**
- Detailed error messages are shown
- Suggestions for fixes are provided

### Example Error Output

```bash
❌ ERRORS (3):

1. apps/corp-authsigner-ui-external/src/userprofile.tsx
   Component file must be PascalCase: userprofile.tsx
   💡 Suggestion: Rename to: UserProfile.tsx

2. apps/corp-authsigner-ui-external/src/components/Button.tsx:15
   Component missing TypeScript props interface/type
   💡 Suggestion: Add interface ButtonProps { ... } for component props

3. packages/shared/src/utils/formatDate.ts:8
   Missing return type annotation
   💡 Suggestion: Add explicit return type: (): string
```

## 🛠 Developer Setup

### Required VSCode Extensions

The repository includes recommended extensions in `.vscode/extensions.json`:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Auto Rename Tag
- Bracket Pair Colorizer

### VSCode Settings

The repository automatically configures VSCode with:

- Format on save
- Auto-fix on save
- Import organization
- Consistent tab spacing
- File nesting patterns

## 🔍 Troubleshooting Common Issues

### ESLint Errors

```bash
# If ESLint shows errors in IDE but not in terminal
npm run lint

# Clear ESLint cache
npx eslint --cache-location node_modules/.cache/eslint --cache
```

### TypeScript Errors

```bash
# If TypeScript shows errors
npm run type-check

# Clear TypeScript cache
npx tsc --build --clean
```

### Pre-commit Hook Issues

```bash
# If pre-commit hooks fail to run
npx husky install

# Re-run pre-commit checks manually
npm run pre-commit
```

### Import/Path Issues

```bash
# Check TypeScript path mapping in tsconfig.json
# Ensure @shared/* paths are correctly configured

# Clear module cache
rm -rf node_modules/.cache
npm install
```

## 📈 Benefits of This Enforcement

1. **Consistent Codebase**: All code follows the same patterns
2. **Reduced Code Review Time**: Automated checks catch issues early
3. **Better Developer Experience**: Clear error messages and suggestions
4. **Maintainability**: Easier to understand and modify code
5. **Team Collaboration**: Everyone follows the same standards
6. **Quality Assurance**: Automated testing and validation

## 🚀 Getting Started

1. **Clone the repository**
2. **Run `npm install`** - Sets up all tooling automatically
3. **Open in VSCode** - IDE configuration is automatic
4. **Start coding** - All enforcement is automatic

The enforcement system is designed to guide developers toward best practices while providing clear feedback when standards aren't met. This ensures a high-quality, maintainable codebase that scales with your team.

## 🔄 Continuous Improvement

This enforcement system is continuously improved. If you encounter issues or have suggestions:

1. Check this documentation first
2. Run the validation commands manually
3. Create an issue with details
4. Suggest improvements to the enforcement rules

Remember: The goal is to help developers write better code, not to make development harder. All rules are designed with developer experience and code quality in mind.
