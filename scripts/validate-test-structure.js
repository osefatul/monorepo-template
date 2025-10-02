#!/usr/bin/env node
import { readFile } from 'fs/promises'
import { glob } from 'glob'
import { basename, dirname, extname } from 'path'

/**
 * Test file structure validation script
 * Enforces testing best practices and ensures test coverage
 */

const VIOLATIONS = []

const addViolation = (type, filePath, line, message, suggestion = '') => {
  VIOLATIONS.push({
    type,
    filePath,
    line,
    message,
    suggestion,
    severity: type === 'error' ? 'ERROR' : 'WARNING',
  })
}

const validateTestFile = async (filePath, content) => {
  const lines = content.split('\n')
  const fileName = basename(filePath)
  const isTestFile = fileName.includes('.test.') || fileName.includes('.spec.')

  if (!isTestFile) {
    return
  }

  // Check for proper test imports
  const hasTestingLibrary = content.includes('@testing-library') || content.includes('vitest')
  const hasDescribe = content.includes('describe(') || content.includes('describe.each(')
  const hasTest =
    content.includes('test(') || content.includes('it(') || content.includes('test.each(')

  if (!hasTestingLibrary && !hasDescribe && !hasTest) {
    addViolation(
      'warning',
      filePath,
      1,
      'Test file appears to have no actual tests',
      'Add describe() and test() or it() blocks'
    )
  }

  // Check for proper test structure
  if (!hasDescribe && (hasTest || content.includes('it('))) {
    addViolation(
      'warning',
      filePath,
      1,
      'Tests should be wrapped in describe() blocks for better organization',
      'Wrap tests in describe("ComponentName", () => { ... })'
    )
  }

  // Check for test file naming convention
  const componentName = fileName.replace(/\.(test|spec)\.(ts|tsx|js|jsx)$/, '')
  if (!/^[A-Z]/.test(componentName) && fileName.includes('.tsx')) {
    addViolation(
      'error',
      filePath,
      1,
      `Test file for React component should start with capital letter: ${fileName}`,
      `Rename to: ${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.test.tsx`
    )
  }

  // Check for proper assertions
  const hasAssertions =
    content.includes('expect(') ||
    content.includes('assert') ||
    content.includes('toBe') ||
    content.includes('toEqual') ||
    content.includes('toBeInTheDocument')

  if ((hasTest || content.includes('it(')) && !hasAssertions) {
    addViolation(
      'error',
      filePath,
      1,
      'Test file contains test blocks but no assertions',
      'Add expect() assertions to verify behavior'
    )
  }

  // Check for async test handling
  lines.forEach((line, index) => {
    if (line.includes('test(') || line.includes('it(')) {
      if (line.includes('async') && !content.includes('await')) {
        addViolation(
          'warning',
          filePath,
          index + 1,
          'Async test function should use await',
          'Use await with async operations in tests'
        )
      }
    }
  })

  // Check for proper cleanup
  if (content.includes('mount(') || content.includes('render(')) {
    if (!content.includes('cleanup') && !content.includes('afterEach')) {
      addViolation(
        'warning',
        filePath,
        1,
        'Component tests should include proper cleanup',
        'Add afterEach(cleanup) or use testing library auto-cleanup'
      )
    }
  }

  // Check for test coverage patterns
  if (fileName.includes('.test.tsx') || fileName.includes('.spec.tsx')) {
    const hasRenderTest = content.includes('render(') || content.includes('mount(')
    const hasInteractionTest = content.includes('fireEvent') || content.includes('userEvent')
    const hasPropsTest = content.includes('props')

    if (!hasRenderTest) {
      addViolation(
        'warning',
        filePath,
        1,
        'React component test should include render test',
        'Add test that renders the component'
      )
    }

    if (
      content.includes('<Button') ||
      content.includes('onClick') ||
      content.includes('onChange')
    ) {
      if (!hasInteractionTest) {
        addViolation(
          'warning',
          filePath,
          1,
          'Interactive component should have interaction tests',
          'Add tests for user interactions (clicks, inputs, etc.)'
        )
      }
    }
  }
}

const checkTestCoverage = async () => {
  console.log('🔍 Checking test coverage...')

  // Find all source files that should have tests
  const sourceFiles = await glob('**/src/**/*.{tsx,ts}', {
    ignore: [
      'node_modules/**',
      '**/dist/**',
      '**/*.d.ts',
      '**/*.test.*',
      '**/*.spec.*',
      '**/index.ts',
      '**/types.ts',
      '**/constants.ts',
    ],
  })

  // Find all test files
  const testFiles = await glob('**/*.{test,spec}.{ts,tsx,js,jsx}', {
    ignore: 'node_modules/**',
  })

  const testFileNames = new Set(
    testFiles.map(f => basename(f).replace(/\.(test|spec)\.(ts|tsx|js|jsx)$/, ''))
  )

  let missingTests = 0

  for (const sourceFile of sourceFiles) {
    const fileName = basename(sourceFile, extname(sourceFile))
    const dir = dirname(sourceFile)

    // Skip utility files and types
    if (fileName.includes('util') || fileName.includes('helper') || fileName.includes('type')) {
      continue
    }

    // Check if it's a React component (starts with capital letter)
    if (/^[A-Z]/.test(fileName)) {
      if (!testFileNames.has(fileName)) {
        addViolation(
          'warning',
          sourceFile,
          1,
          `React component missing test file`,
          `Create ${fileName}.test.tsx in the same directory or __tests__ folder`
        )
        missingTests++
      }
    }
  }

  if (missingTests > 0) {
    console.log(`⚠️  Found ${missingTests} components without tests`)
  } else {
    console.log('✅ All components have corresponding test files')
  }
}

const scanTestFiles = async () => {
  const testFiles = await glob('**/*.{test,spec}.{ts,tsx,js,jsx}', {
    ignore: 'node_modules/**',
  })

  console.log(`📋 Found ${testFiles.length} test files to validate`)

  for (const filePath of testFiles) {
    try {
      const content = await readFile(filePath, 'utf-8')
      await validateTestFile(filePath, content)
    } catch (error) {
      addViolation('error', filePath, 1, `Cannot read test file: ${error.message}`)
    }
  }
}

const generateReport = () => {
  if (VIOLATIONS.length === 0) {
    console.log('✅ All test files follow the best practices!')
    return true
  }

  console.log('🧪 Test Structure Validation Report\n')
  console.log('='.repeat(60))

  const errors = VIOLATIONS.filter(v => v.severity === 'ERROR')
  const warnings = VIOLATIONS.filter(v => v.severity === 'WARNING')

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):\n`)
    errors.forEach((violation, index) => {
      console.log(
        `${index + 1}. ${violation.filePath}${violation.line ? `:${violation.line}` : ''}`
      )
      console.log(`   ${violation.message}`)
      if (violation.suggestion) {
        console.log(`   💡 Suggestion: ${violation.suggestion}`)
      }
      console.log('')
    })
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):\n`)
    warnings.forEach((violation, index) => {
      console.log(
        `${index + 1}. ${violation.filePath}${violation.line ? `:${violation.line}` : ''}`
      )
      console.log(`   ${violation.message}`)
      if (violation.suggestion) {
        console.log(`   💡 Suggestion: ${violation.suggestion}`)
      }
      console.log('')
    })
  }

  console.log('='.repeat(60))
  console.log(`\nSummary: ${errors.length} errors, ${warnings.length} warnings`)
  console.log('\nRefer to testing best practices documentation for guidelines.\n')

  return errors.length === 0
}

// Main execution
const main = async () => {
  console.log('🧪 Validating test file structure and coverage...\n')

  await scanTestFiles()
  await checkTestCoverage()

  const success = generateReport()
  process.exit(success ? 0 : 1)
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Test validation script failed:', error)
    process.exit(1)
  })
}

export { validateTestFile, checkTestCoverage, scanTestFiles }
