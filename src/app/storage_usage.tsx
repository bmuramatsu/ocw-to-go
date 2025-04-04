// Displays the storage usage at the bottom of the page
import React from "react";
import { useFormattedBytes } from "./utils/format_bytes";

type UsageData = {
  usedPercent: number;
  usedSpace: string;
  totalSpace: string;
};

export default function StorageUsage() {
  const estimate = useStorageEstimate();
  const storage = useStorage(estimate);

  if (!storage) return null;

  return (
    <span>
      Storage: {storage.usedPercent}% used ({storage.usedSpace} of{" "}
      {storage.totalSpace})
    </span>
  );
}

function useStorageEstimate(): StorageEstimate {
  const [estimate, setEstimate] = React.useState<StorageEstimate>({
    quota: undefined,
    usage: undefined,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      navigator.storage.estimate().then(setEstimate);
    }, 5000);

    navigator.storage.estimate().then(setEstimate);

    return () => clearInterval(interval);
  }, [setEstimate]);

  return estimate;
}

function useStorage(estimate: StorageEstimate): UsageData | null {
  const { usage, quota } = estimate;

  const formattedQuota = useFormattedBytes(quota || 0);
  const formattedUsage = useFormattedBytes(usage || 0);

  if (usage === undefined || quota === undefined || quota === 0) {
    return null;
  }

  let usedPercent = (usage / quota) * 100;
  usedPercent = Math.round(usedPercent);
  return {
    usedPercent,
    usedSpace: formattedUsage,
    totalSpace: formattedQuota,
  };
}
