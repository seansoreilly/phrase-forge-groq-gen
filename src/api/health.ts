import { getBuildInfo } from "@/lib/build-info";

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  build: {
    commitHash: string;
    buildTime: string;
    buildVersion: string;
    environment: string;
  };
  uptime?: number;
}

/**
 * Health check endpoint that includes build information
 */
export async function getHealthStatus(): Promise<HealthResponse> {
  const buildInfo = getBuildInfo();
  
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    build: {
      commitHash: buildInfo.commitHash,
      buildTime: buildInfo.buildTime,
      buildVersion: buildInfo.buildVersion,
      environment: buildInfo.environment,
    },
    // Add uptime if available (for server-side usage)
    ...(typeof process !== 'undefined' && process.uptime && {
      uptime: process.uptime(),
    }),
  };
} 