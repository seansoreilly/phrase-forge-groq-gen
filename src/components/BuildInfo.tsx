import { getBuildInfo, formatBuildTime } from "@/lib/build-info";

interface BuildInfoProps {
  variant?: "minimal" | "detailed";
  className?: string;
}

export function BuildInfo({
  variant = "minimal",
  className = "",
}: BuildInfoProps) {
  const buildInfo = getBuildInfo();

  if (variant === "minimal") {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        <span className="font-mono">v{buildInfo.commitHash}</span>
      </div>
    );
  }

  return (
    <div className={`text-xs text-gray-500 space-y-1 ${className}`}>
      <div className="font-mono">
        <span className="font-semibold">Build:</span>{" "}
        <span className="text-gray-600">{buildInfo.commitHash}</span>
      </div>
      <div>
        <span className="font-semibold">Built:</span>{" "}
        <span className="text-gray-600">
          {formatBuildTime(buildInfo.buildTime)}
        </span>
      </div>
      <div>
        <span className="font-semibold">Env:</span>{" "}
        <span className="text-gray-600">{buildInfo.environment}</span>
      </div>
    </div>
  );
}

export function DevelopmentBuildInfo() {
  const buildInfo = getBuildInfo();

  // Only show in development
  if (!buildInfo.isDevelopment) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded-md shadow-lg z-50">
      <div className="text-xs font-mono">
        <div>Commit: {buildInfo.commitHash}</div>
        <div>Env: {buildInfo.environment}</div>
      </div>
    </div>
  );
}
