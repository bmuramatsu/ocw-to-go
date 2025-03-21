// Displays the storage usage at the bottom of the page
import React from "react";
import { formatBytes } from "./utils/format_bytes";

type UsageData = {
  usedPercent: number;
  usedSpace: string;
  totalSpace: string;
};

export default function StorageUsage() {
  const [usage, setUsage] = React.useState<UsageData | null>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      calculateUsage().then(setUsage);
    }, 5000);

    calculateUsage().then(setUsage);

    return () => clearInterval(interval);
  }, [setUsage]);

  if (!usage) return null;

  return (
    <span>
      Storage: {usage.usedPercent}% used ({usage.usedSpace} of{" "}
      {usage.totalSpace})
    </span>
  );
}

async function calculateUsage(): Promise<UsageData | null> {
  const data = await navigator.storage.estimate();
  const { usage, quota } = data;
  if (usage === undefined || quota === undefined) {
    return null;
  }

  let usedPercent = (usage / quota) * 100;
  usedPercent = Math.round(usedPercent);
  return {
    usedPercent,
    usedSpace: formatBytes(usage),
    totalSpace: formatBytes(quota),
  };
}
