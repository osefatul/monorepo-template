#!/usr/bin/env node
import { readFile } from 'fs/promises'
import { glob } from 'glob'

/**
 * Component structure validation script
 * Enforces React component best practices and structure
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

const validateComponentStructure = (content, filePath) => {
  const lines = content.split('\n')

  // Check for React import
  const hasReactImport =
    content.includes('import') &&
    (content.includes("from 'react'") || content.includes('from "react"'))

  if (!hasReactImport && content.includes('React.')) {
    addViolation('error', filePath, 1, 'Missing React import', "Add: import { ... } from 'react'")
  }

  // Check for TypeScript interface for props
  const hasInterface = content.includes('interface ') && content.includes('Props')
  const hasType = content.includes('type ') && content.includes('Props')
  const isComponent =
    content.includes('export') &&
    (content.includes('const ') || content.includes('function ')) &&
    content.includes('return')

  if (isComponent && !hasInterface && !hasType) {
    addViolation(
      'error',
      filePath,
      1,
      'Component missing TypeScript props interface/type',
      'Add interface ComponentNameProps { ... } for component props'
    )
  }

  // Check for proper component naming (PascalCase)
  const componentMatches = content.match(/export\s+const\s+(\w+)\s*=/g)
  if (componentMatches) {
    componentMatches.forEach(match => {
      const componentName = match.match(/export\s+const\s+(\w+)\s*=/)[1]
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
        addViolation(
          'error',
          filePath,
          1,
          `Component name must be PascalCase: ${componentName}`,
          `Rename to: ${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`
        )
      }
    })
  }

  // Check for default props destructuring
  lines.forEach((line, index) => {
    if (line.includes('= ({') && line.includes('}: ') && line.includes('Props')) {
      // Good: destructured props with defaults
      return
    }

    if (line.includes('function ') && line.includes('props') && !line.includes('{')) {
      addViolation(
        'warning',
        filePath,
        index + 1,
        'Consider destructuring props in function parameters',
        'Use: ({ prop1, prop2 }: Props) instead of (props: Props)'
      )
    }
  })

  // Check for proper JSX return
  const hasReturn = content.includes('return (') || content.includes('return <')
  if (isComponent && !hasReturn) {
    addViolation(
      'error',
      filePath,
      1,
      'Component must return JSX',
      'Add proper return statement with JSX'
    )
  }

  // Check for unused imports
  const importLines = lines.filter(line => line.trim().startsWith('import'))
  importLines.forEach((line, index) => {
    const importMatch = line.match(/import\s+{([^}]+)}\s+from/)
    if (importMatch) {
      const imports = importMatch[1].split(',').map(imp => imp.trim())
      imports.forEach(imp => {
        const cleanImport = imp.replace(/\s+as\s+\w+/, '') // Remove 'as' aliases
        if (
          !content.includes(cleanImport) ||
          content.indexOf(cleanImport) === content.indexOf(line)
        ) {
          addViolation(
            'warning',
            filePath,
            index + 1,
            `Unused import: ${cleanImport}`,
            'Remove unused import'
          )
        }
      })
    }
  })

  // Check for console.log (should be removed in production)
  lines.forEach((line, index) => {
    if (
      line.includes('console.log') ||
      line.includes('console.warn') ||
      line.includes('console.error')
    ) {
      addViolation(
        'warning',
        filePath,
        index + 1,
        'Console statements found',
        'Remove console statements before committing'
      )
    }
  })

  // Check for proper export
  const hasDefaultExport = content.includes('export default')
  const hasNamedExport = content.includes('export const') || content.includes('export function')

  if (!hasDefaultExport && !hasNamedExport) {
    addViolation(
      'error',
      filePath,
      1,
      'Component must be exported',
      'Add export statement for your component'
    )
  }

  // Check for accessibility attributes
  if (content.includes('<button') && !content.includes('aria-') && !content.includes('role=')) {
    addViolation(
      'warning',
      filePath,
      1,
      'Consider adding accessibility attributes to interactive elements',
      'Add aria-label, role, or other accessibility attributes'
    )
  }

  if (content.includes('<img') && !content.includes('alt=')) {
    addViolation(
      'error',
      filePath,
      1,
      'Images must have alt attributes',
      'Add alt="" or alt="description" to <img> tags'
    )
  }

  // Check for key prop in lists
  if (content.includes('.map(') && content.includes('<') && !content.includes('key=')) {
    addViolation(
      'error',
      filePath,
      1,
      'Missing key prop in list items',
      'Add unique key prop to elements in .map()'
    )
  }

  // Check for proper state updates
  if (content.includes('useState') && content.includes('set') && content.includes('[')) {
    // Basic check for state mutation
    const stateLines = lines.filter(line => line.includes('set') && line.includes('('))
    stateLines.forEach((line, index) => {
      if (line.includes('.push(') || line.includes('.pop(') || line.includes('.splice(')) {
        addViolation(
          'error',
          filePath,
          index + 1,
          'Direct state mutation detected',
          'Use immutable updates: setState([...state, newItem])'
        )
      }
    })
  }

  // Check for useEffect dependencies
  if (content.includes('useEffect') && content.includes('[')) {
    const effectMatches = content.match(/useEffect\([^}]*}[^[]*\[([^\]]*)\]/g)
    if (effectMatches) {
      effectMatches.forEach(match => {
        const deps = match.match(/\[([^\]]*)\]/)[1].trim()
        if (deps === '') {
          // Empty dependency array is sometimes intentional
          return
        }

        // This is a simplified check - a real implementation would be more sophisticated
        if (match.includes('state') && !deps.includes('state')) {
          addViolation(
            'warning',
            filePath,
            1,
            'useEffect may be missing dependencies',
            'Ensure all used variables are in the dependency array'
          )
        }
      })
    }
  }
}

const scanComponentFiles = async () => {
  const componentFiles = await glob('apps/**/src/**/*.{tsx,jsx}', { ignore: 'node_modules/**' })
  const packageFiles = await glob('packages/**/src/**/*.{tsx,jsx}', { ignore: 'node_modules/**' })

  const allFiles = [...componentFiles, ...packageFiles]

  for (const filePath of allFiles) {
    try {
      const content = await readFile(filePath, 'utf-8')
      validateComponentStructure(content, filePath)
    } catch (error) {
      addViolation('error', filePath, 1, `Cannot read file: ${error.message}`)
    }
  }
}

const generateReport = () => {
  if (VIOLATIONS.length === 0) {
    console.log(' All components follow the best practices!')
    return true
  }

  console.log(' Component Structure Validation Report\n')
  console.log('='.repeat(60))

  const errors = VIOLATIONS.filter(v => v.severity === 'ERROR')
  const warnings = VIOLATIONS.filter(v => v.severity === 'WARNING')

  if (errors.length > 0) {
    console.log(`\n ERRORS (${errors.length}):\n`)
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
    console.log(`\n  WARNINGS (${warnings.length}):\n`)
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
  console.log('\nPlease fix the errors before committing your changes.')
  console.log('Refer to DEVELOPMENT_BEST_PRACTICES.md for detailed guidelines.\n')

  return errors.length === 0
}

// Main execution
const main = async () => {
  console.log(' Validating React component structure and best practices...\n')

  await scanComponentFiles()
  const success = generateReport()

  process.exit(success ? 0 : 1)
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Script execution failed:', error)
    process.exit(1)
  })
}
