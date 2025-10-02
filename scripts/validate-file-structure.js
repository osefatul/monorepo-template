#!/usr/bin/env node
import { readdir, stat } from 'fs/promises'
import { basename, dirname, extname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * File naming and structure validation script
 * Enforces the development best practices for file naming and project structure
 */

const VALID_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.scss']
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx']

// Naming convention patterns
const PATTERNS = {
  // PascalCase for components
  COMPONENT: /^[A-Z][a-zA-Z0-9]*\.tsx?$/,
  // camelCase for utilities, hooks, services
  CAMEL_CASE: /^[a-z][a-zA-Z0-9]*\.(ts|js)$/,
  // kebab-case for directories
  KEBAB_CASE: /^[a-z0-9]+(-[a-z0-9]+)*$/,
  // lowercase for config files
  CONFIG: /^[a-z0-9]+(\.[a-z0-9]+)*\.(json|js|ts|md|yml|yaml)$/,
  // Test files
  TEST: /^[A-Za-z0-9]+\.(test|spec)\.(ts|tsx|js|jsx)$/,
}

// Directory structure validation
const _REQUIRED_STRUCTURE = {
  apps: ['src'],
  packages: ['src'],
  src: ['components', 'types', 'utils'],
}

const VIOLATIONS = []

const addViolation = (type, path, message, suggestion = '') => {
  VIOLATIONS.push({
    type,
    path,
    message,
    suggestion,
    severity: type === 'error' ? 'ERROR' : 'WARNING',
  })
}

const validateFileName = (filePath, fileName) => {
  const ext = extname(fileName)
  const nameWithoutExt = basename(fileName, ext)

  // Skip hidden files and node_modules
  if (fileName.startsWith('.') || filePath.includes('node_modules') || filePath.includes('dist')) {
    return
  }

  // Validate file extensions
  if (!VALID_EXTENSIONS.includes(ext)) {
    addViolation(
      'error',
      filePath,
      `Invalid file extension: ${ext}`,
      `Use one of: ${VALID_EXTENSIONS.join(', ')}`
    )
    return
  }

  // Component files must be PascalCase
  if (COMPONENT_EXTENSIONS.includes(ext)) {
    if (!PATTERNS.COMPONENT.test(fileName)) {
      addViolation(
        'error',
        filePath,
        `Component file must be PascalCase: ${fileName}`,
        `Rename to: ${nameWithoutExt
          .replace(/^[a-z]/, c => c.toUpperCase())
          .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())}${ext}`
      )
    }

    // Check if component file is in components directory
    if (!filePath.includes('/components/') && !filePath.includes('\\components\\')) {
      addViolation(
        'warning',
        filePath,
        'Component files should be in a components directory',
        'Move to src/components/ directory'
      )
    }
  }

  // Utility/service files should be camelCase
  if (
    (ext === '.ts' || ext === '.js') &&
    !fileName.includes('.test.') &&
    !fileName.includes('.spec.')
  ) {
    const isConfigFile = ['config', 'setup', 'index'].some(
      word => nameWithoutExt.toLowerCase() === word
    )

    if (!isConfigFile && !PATTERNS.CAMEL_CASE.test(fileName)) {
      addViolation(
        'error',
        filePath,
        `Utility/service file must be camelCase: ${fileName}`,
        `Rename to: ${nameWithoutExt.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())}${ext}`
      )
    }
  }

  // Test files validation
  if (fileName.includes('.test.') || fileName.includes('.spec.')) {
    if (!PATTERNS.TEST.test(fileName)) {
      addViolation('error', filePath, `Test file naming is incorrect: ${fileName}`)
    }
  }

  // Config files validation
  const configFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'eslint.config.js']
  if (configFiles.includes(fileName) || fileName.startsWith('.')) {
    // Config files are okay
    return
  }
}

const validateDirectoryName = (dirPath, dirName) => {
  // Skip hidden directories and node_modules
  if (dirName.startsWith('.') || dirName === 'node_modules' || dirName === 'dist') {
    return
  }

  // Special directories that can be camelCase or PascalCase
  const specialDirs = ['src', 'apps', 'packages', 'docs', 'scripts', 'public', 'assets']
  if (specialDirs.includes(dirName)) {
    return
  }

  // Most directories should be kebab-case
  if (!PATTERNS.KEBAB_CASE.test(dirName)) {
    addViolation(
      'error',
      dirPath,
      `Directory must be kebab-case: ${dirName}`,
      `Rename to: ${dirName
        .toLowerCase()
        .replace(/[_\s]+/g, '-')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()}`
    )
  }
}

const _validateProjectStructure = (_basePath, _expectedStructure) => {
  // This is a simplified structure validation
  // In a real scenario, you might want more complex validation
}

const scanDirectory = async dirPath => {
  try {
    const items = await readdir(dirPath)

    for (const item of items) {
      const itemPath = join(dirPath, item)
      const stats = await stat(itemPath)

      if (stats.isDirectory()) {
        validateDirectoryName(itemPath, item)
        await scanDirectory(itemPath) // Recursive scan
      } else {
        validateFileName(itemPath, item)
      }
    }
  } catch (error) {
    addViolation('error', dirPath, `Cannot scan directory: ${error.message}`)
  }
}

const generateReport = () => {
  if (VIOLATIONS.length === 0) {
    console.log(' All files and directories follow the naming conventions!')
    return true
  }

  console.log(' File Structure Validation Report\n')
  console.log('='.repeat(50))

  const errors = VIOLATIONS.filter(v => v.severity === 'ERROR')
  const warnings = VIOLATIONS.filter(v => v.severity === 'WARNING')

  if (errors.length > 0) {
    console.log(`\n ERRORS (${errors.length}):\n`)
    errors.forEach((violation, index) => {
      console.log(`${index + 1}. ${violation.path}`)
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
      console.log(`${index + 1}. ${violation.path}`)
      console.log(`   ${violation.message}`)
      if (violation.suggestion) {
        console.log(`   💡 Suggestion: ${violation.suggestion}`)
      }
      console.log('')
    })
  }

  console.log('='.repeat(50))
  console.log(`\nSummary: ${errors.length} errors, ${warnings.length} warnings`)
  console.log('\nPlease fix the errors before committing your changes.')
  console.log('Refer to DEVELOPMENT_BEST_PRACTICES.md for detailed guidelines.\n')

  return errors.length === 0
}

// Main execution
const main = async () => {
  const targetDirs = ['apps', 'packages']

  console.log(' Validating file structure and naming conventions...\n')

  for (const dir of targetDirs) {
    console.log(`Scanning ${dir}/...`)
    await scanDirectory(dir)
  }

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

export { validateFileName, validateDirectoryName, scanDirectory }
