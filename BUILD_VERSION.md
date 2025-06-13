# Build Version Display Implementation

This document explains how build version information is implemented in the Music Passphrase project.

## Overview

The project implements a comprehensive build version display system that works across all deployment environments:

- **Local Development**: Shows git commit hash from local repository
- **Vercel Production**: Uses `VERCEL_GIT_COMMIT_SHA` environment variable
- **GitHub Actions**: Uses `GITHUB_SHA` environment variable
- **Other CI/CD**: Supports generic `CI_COMMIT_SHA` variable

## Implementation Details

### 1. Vite Configuration (`vite.config.ts`)

Build information is injected at build time using Vite's `define` feature:

```typescript
function getBuildInfo() {
  // Multi-environment git commit hash resolution
  // Priority: Vercel → GitHub → CI → Local Git

  return {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __BUILD_TIME__: JSON.stringify(buildTime),
    __BUILD_VERSION__: JSON.stringify(buildVersion),
    __NODE_ENV__: JSON.stringify(environment),
  };
}
```

### 2. TypeScript Declarations (`src/vite-env.d.ts`)

Build-time constants are properly typed:

```typescript
declare const __COMMIT_HASH__: string;
declare const __BUILD_TIME__: string;
declare const __BUILD_VERSION__: string;
declare const __NODE_ENV__: string;
```

### 3. Build Info Utility (`src/lib/build-info.ts`)

Safe interface for accessing build information:

```typescript
export interface BuildInfo {
  commitHash: string;
  buildTime: string;
  buildVersion: string;
  environment: string;
  isProduction: boolean;
  isDevelopment: boolean;
}
```

### 4. Display Components (`src/components/BuildInfo.tsx`)

Two main components for displaying build information:

- **`BuildInfo`**: General purpose component with `minimal` and `detailed` variants
- **`DevelopmentBuildInfo`**: Development-only overlay showing commit hash

### 5. Health Check API (`src/api/health.ts`)

Health endpoint that includes build information for monitoring:

```typescript
export interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  build: {
    commitHash: string;
    buildTime: string;
    buildVersion: string;
    environment: string;
  };
}
```

## Usage Examples

### Basic Footer Display

```tsx
import { BuildInfo } from "@/components/BuildInfo";

<footer className="text-center">
  <BuildInfo variant="minimal" />
</footer>;
```

### Development Overlay

```tsx
import { DevelopmentBuildInfo } from "@/components/BuildInfo";

// Automatically shows only in development
<DevelopmentBuildInfo />;
```

### Detailed Build Information

```tsx
<BuildInfo variant="detailed" className="p-4" />
```

## Build Scripts

Enhanced package.json scripts for different environments:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:production": "npm run lint && vite build --mode production",
    "build:vercel": "vite build --mode production",
    "health": "node -e \"import('./dist/api/health.js').then(h => h.getHealthStatus().then(console.log))\"",
    "version": "node -e \"console.log(require('./package.json').version)\""
  }
}
```

## Environment Variables

The system automatically detects and uses these environment variables in order of priority:

1. `VERCEL_GIT_COMMIT_SHA` (Vercel deployments)
2. `GITHUB_SHA` (GitHub Actions)
3. `CI_COMMIT_SHA` (Generic CI/CD)
4. Local git command fallback

No manual configuration required for standard deployment platforms.

## Verification

To verify the build system is working:

### 1. Check Build Output

```bash
npm run build
# Should show: "Using local git commit hash: abc1234"
```

### 2. Test Health Endpoint

```bash
npm run health
# Should return JSON with build information
```

### 3. Development Mode

```bash
npm run dev
# Visit http://localhost:8080
# Should see build version in footer and development overlay
```

## Current Implementation Status

✅ **Implemented:**

- Multi-environment git commit hash detection
- Build time tracking
- Development/production environment detection
- Footer display component
- Development overlay
- Health check API
- TypeScript type safety
- Enhanced build scripts

✅ **Tested:**

- Local development build
- Production build process
- Git commit hash detection
- Component rendering

## Related Documentation

- See [`.cursor/rules/git-commit-hash.mdc`](.cursor/rules/git-commit-hash.mdc) for comprehensive implementation patterns
- Check `src/components/BuildInfo.tsx` for component usage examples
- Review `src/lib/build-info.ts` for utility function details
