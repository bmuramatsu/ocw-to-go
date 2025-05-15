import React from "react";

// Co-pilot wrote this :P
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  i = Math.min(i, 4); // Ensure we don't go above TB
  const precision = i < 3 ? 0 : 2; // round to whole number for Bytes, KB, MB
  return parseFloat((bytes / Math.pow(k, i)).toFixed(precision)) + " " + sizes[i];
}

export function useFormattedBytes(bytes: number): string {
  return React.useMemo(() => {
    return formatBytes(bytes);
  }, [bytes]);
}
