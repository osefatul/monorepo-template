# Corp Auth Signer Monorepo

A production-ready npm workspace monorepo for corporate authentication signing applications with comprehensive tooling, testing, and deployment configuration.

## 🚀 Features

✅ **Modern Tech Stack** - TypeScript, React 18, Vite 5
✅ **Comprehensive Testing** - Vitest + React Testing Library
✅ **Code Quality** - ESLint, Prettier, Husky, lint-staged
✅ **Git Hooks** - Pre-commit validation and conventional commits
✅ **CI/CD Pipeline** - GitLab CI/CD with automated testing and deployment
✅ **VS Code Integration** - Optimized settings, tasks, and debugging
✅ **Docker Ready** - Multi-stage builds with nginx
✅ **Environment Management** - Type-safe env configuration utilities
✅ **Bundle Analysis** - Performance monitoring and optimization
✅ **Developer Experience** - Comprehensive scripts and automation

## 📁 Project Structure

```
corp-authsigner-monorepo/
├── apps/
│   ├── corp-authsigner-ui-internal/     # Internal app (port 3001)
│   └── corp-authsigner-ui-external/     # External app (port 3002)
├── packages/
│   └── shared/                          # Shared components & utilities
├── .gitlab/
│   ├── merge_request_templates/         # MR templates
│   └── issue_templates/                 # Issue templates
├── .vscode/                             # VS Code configuration
├── .husky/                              # Git hooks
├── docker/                              # Docker configurations
└── Dockerfile.{internal,external}       # Multi-stage builds
```

## 🛠 Technology Stack

| Category         | Technologies                                  |
| ---------------- | --------------------------------------------- |
| **Frontend**     | TypeScript 5.6+, React 18.3+, Vite 5.4+       |
| **Testing**      | Vitest, React Testing Library, jsdom          |
| **Code Quality** | ESLint, Prettier, Husky, lint-staged          |
| **CI/CD**        | GitLab CI/CD, Security Scanning               |
| **Deployment**   | Docker, nginx, docker-compose                 |
| **Monorepo**     | npm workspaces, TypeScript project references |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional, for deployment)

### Installation

```bash
# Clone and install dependencies
git clone <repository-url>
cd corp-authsigner-monorepo
npm install
```

### Development

```bash
# Start both apps concurrently
npm run dev:both

# Or start individually
npm run dev:internal    # http://localhost:3001
npm run dev:external    # http://localhost:3002
```

### Building

```bash
# Build everything (shared → internal → external)
npm run build:all

# Build individually
npm run build:shared
npm run build:internal
npm run build:external
```

## 🧪 Testing

```bash
# Run all tests
npm run test:run

# Run tests with UI
npm run test

# Generate coverage
npm run test:coverage

# Run tests for specific package
npm run test --workspace=shared
```

## 🔧 Code Quality

### Linting & Formatting

```bash
# Check and fix all issues
npm run fix-all

# Individual commands
npm run lint           # Check linting
npm run lint:fix       # Fix linting issues
npm run format         # Format code
npm run format:check   # Check formatting
```

### Pre-commit Hooks

Automatic validation on commit:

- ✅ Linting with auto-fix
- ✅ Code formatting
- ✅ Type checking
- ✅ Test execution
- ✅ Commit message validation

## 📦 Shared Package

### Components

```typescript
import { Button, Card, LoadingSpinner } from '@shared/components'

<Button variant="primary" loading={isLoading}>
  Submit
</Button>
```

### Utilities

```typescript
import { debounce, formatDate, validateEmail } from '@shared/utils'

const isValid = validateEmail('user@example.com')
const formatted = formatDate(new Date())
const debouncedSearch = debounce(searchFn, 300)
```

### Environment Configuration

```typescript
import { getEnvBool, getEnvVar, isProduction } from '@shared/config'

const apiUrl = getEnvVar('API_BASE_URL', 'http://localhost:8000')
const debugMode = getEnvBool('ENABLE_DEBUGGING', !isProduction())
```

### Types

```typescript
import { ApiResponse, AuthSignature, User } from '@shared/types'

const user: User = { id: '1', email: 'user@corp.com', role: 'internal' }
```

## 🚢 Docker Deployment

### Build Images

```bash
# Build both applications
docker-compose build

# Build specific app
docker build -f Dockerfile.internal -t corp-internal .
```

### Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# Access applications
# Internal: http://localhost:8080
# External: http://localhost:8081
# Traefik Dashboard: http://localhost:8080
```

### Individual Containers

```bash
# Run internal app
docker run -p 8080:80 corp-internal

# Run external app
docker run -p 8081:80 corp-external
```

## 📝 Available Scripts

### Root Level Scripts

| Script         | Description                  |
| -------------- | ---------------------------- |
| `dev:both`     | Start both apps concurrently |
| `dev:internal` | Start internal app only      |
| `dev:external` | Start external app only      |
| `build:all`    | Build all packages in order  |
| `check-all`    | Run all quality checks       |
| `fix-all`      | Fix linting and formatting   |
| `clean`        | Clean build artifacts        |
| `reset`        | Full cleanup and reinstall   |
| `ci`           | Complete CI pipeline locally |

### Quality Assurance

| Script                    | Description               |
| ------------------------- | ------------------------- |
| `type-check`              | TypeScript validation     |
| `lint` / `lint:fix`       | ESLint checks             |
| `format` / `format:check` | Prettier formatting       |
| `test:run`                | Run all tests             |
| `test:coverage`           | Generate coverage reports |

### Maintenance

| Script        | Description                 |
| ------------- | --------------------------- |
| `deps:check`  | Check for outdated packages |
| `deps:update` | Update dependencies         |
| `analyze`     | Bundle size analysis        |

## ⚙️ Environment Configuration

### Setup Environment Files

```bash
# Copy example files
cp .env.example .env
cp apps/corp-authsigner-ui-internal/.env.example apps/corp-authsigner-ui-internal/.env
cp apps/corp-authsigner-ui-external/.env.example apps/corp-authsigner-ui-external/.env
```

### Environment Variables

Key variables for each application:

**Internal App:**

- `VITE_AUTH_DOMAIN` - Internal authentication domain
- `VITE_API_BASE_URL` - Internal API endpoint
- `VITE_ENABLE_DEBUGGING` - Debug mode toggle

**External App:**

- `VITE_AUTH_DOMAIN` - External authentication domain
- `VITE_API_BASE_URL` - External API endpoint
- `VITE_RATE_LIMIT_ENABLED` - Rate limiting toggle

## 🔍 VS Code Integration

The repository includes optimized VS Code configuration:

- **Settings** - Formatting, linting, and editor preferences
- **Extensions** - Recommended extensions for the stack
- **Tasks** - Build, test, and development tasks
- **Launch** - Debug configurations for apps and tests

### Recommended Extensions

- ESLint & Prettier
- TypeScript & React support
- Vitest Explorer
- GitLens
- Docker support

## 🔄 CI/CD Pipeline

### GitLab CI/CD Workflow

- ✅ **Quality Checks** - Linting, formatting, type checking
- ✅ **Testing** - Unit tests with coverage reporting
- ✅ **Build Validation** - Ensure all packages build successfully
- ✅ **Security Scanning** - SAST, dependency audits, vulnerability checks
- ✅ **Docker Images** - Multi-stage builds pushed to GitLab Registry
- ✅ **Automated Deployment** - Staging and production deployments

### Branch Strategy

- `main` - Production deployments
- `develop` - Staging deployments
- Feature branches - Merge requests with full validation

### GitLab Features

- **Container Registry** - Built-in Docker image storage
- **Security Dashboard** - Vulnerability management
- **Merge Request Templates** - Standardized review process
- **Issue Templates** - Bug reports and feature requests
- **CODEOWNERS** - Automated reviewer assignment

## 🏗 Development Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Edit code with full TypeScript support
   - Tests run automatically in watch mode
   - Pre-commit hooks ensure quality

3. **Commit Changes**

   ```bash
   git commit -m "feat: add new authentication feature"
   # Conventional commits enforced
   ```

4. **Push and Create MR**
   - Automated CI/CD validation
   - Code review with MR template
   - Deployment preview links

## 🔧 Troubleshooting

### Common Issues

**Build Failures:**

```bash
# Clear all caches and rebuild
npm run reset
```

**Type Errors:**

```bash
# Rebuild shared package
npm run build:shared
```

**Port Conflicts:**

```bash
# Kill processes on ports
npx kill-port 3001 3002
```

**Docker Issues:**

```bash
# Clean Docker cache
docker system prune -a
```

## 📈 Performance

### Bundle Analysis

```bash
# Analyze bundle sizes
npm run analyze --workspace=corp-authsigner-ui-internal
npm run analyze --workspace=corp-authsigner-ui-external
```

### Optimization Features

- ✅ Code splitting with manual chunks
- ✅ Tree shaking for unused code elimination
- ✅ Asset optimization and compression
- ✅ CDN-ready static assets
- ✅ Service worker ready structure
