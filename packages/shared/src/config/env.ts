/**
 * Environment configuration utilities
 */

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  API_BASE_URL: string
  API_TIMEOUT: number
  ENABLE_DEBUGGING: boolean
  ENABLE_ANALYTICS: boolean
  APP_NAME: string
  APP_VERSION: string
}

/**
 * Get environment variable with type safety and validation
 */
export const getEnvVar = (
  key: string,
  defaultValue?: string,
  required = false
): string => {
  // For client-side (Vite), check for VITE_ prefix
  const viteKey = `VITE_${key}`
  const value = 
    (typeof window !== 'undefined' && import.meta.env?.[viteKey]) ||
    (typeof process !== 'undefined' && process.env?.[key]) ||
    (typeof window !== 'undefined' && import.meta.env?.[key]) ||
    defaultValue

  if (required && !value) {
    throw new Error(`Environment variable ${key} is required but not set`)
  }

  return value || ''
}

/**
 * Get environment variable as boolean
 */
export const getEnvBool = (
  key: string,
  defaultValue = false,
  required = false
): boolean => {
  const value = getEnvVar(key, defaultValue.toString(), required)
  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * Get environment variable as number
 */
export const getEnvNumber = (
  key: string,
  defaultValue?: number,
  required = false
): number => {
  const value = getEnvVar(key, defaultValue?.toString(), required)
  const parsed = parseInt(value, 10)
  
  if (isNaN(parsed) && required) {
    throw new Error(`Environment variable ${key} must be a valid number`)
  }
  
  return isNaN(parsed) ? (defaultValue || 0) : parsed
}

/**
 * Validate required environment variables
 */
export const validateEnv = (requiredVars: string[]): void => {
  const missing = requiredVars.filter(key => !getEnvVar(key))
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}

/**
 * Get current environment
 */
export const getCurrentEnv = (): EnvConfig['NODE_ENV'] => {
  const env = getEnvVar('NODE_ENV', 'development') as EnvConfig['NODE_ENV']
  
  if (!['development', 'production', 'test'].includes(env)) {
    console.warn(`Invalid NODE_ENV: ${env}, defaulting to development`)
    return 'development'
  }
  
  return env
}

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => getCurrentEnv() === 'development'

/**
 * Check if running in production
 */
export const isProduction = (): boolean => getCurrentEnv() === 'production'

/**
 * Check if running in test
 */
export const isTest = (): boolean => getCurrentEnv() === 'test'

/**
 * Get app configuration
 */
export const getAppConfig = (): Partial<EnvConfig> => ({
  NODE_ENV: getCurrentEnv(),
  API_BASE_URL: getEnvVar('API_BASE_URL', 'http://localhost:8000'),
  API_TIMEOUT: getEnvNumber('API_TIMEOUT', 30000),
  ENABLE_DEBUGGING: getEnvBool('ENABLE_DEBUGGING', isDevelopment()),
  ENABLE_ANALYTICS: getEnvBool('ENABLE_ANALYTICS', isProduction()),
  APP_NAME: getEnvVar('APP_NAME', 'Corp Auth Signer'),
  APP_VERSION: getEnvVar('APP_VERSION', '1.0.0'),
})