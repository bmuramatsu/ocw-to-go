import React from "react";
import { useServiceWorker } from "./service_worker_provider";

interface ServiceWorkerWaiterProps {
  children: React.ReactNode;
}

export default function ServiceWorkerWaiter({
  children,
}: ServiceWorkerWaiterProps) {
  const { ready } = useServiceWorker();
  if (!ready) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}
