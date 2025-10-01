import React from "react";

type ServiceWorkerContextData = {
  ready: boolean;
};

const ServiceWorkerContext = React.createContext<ServiceWorkerContextData>({
  ready: false,
});

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export function ServiceWorkerProvider({
  children,
}: ServiceWorkerProviderProps) {
  const [waiting, setWaiting] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    navigator.serviceWorker.register("/worker.js").then((registration) => {
      // We check for the waiting state in 2 ways. The event listener catches
      // it immediately, and the static check will catch if after refreshes.
      // Refreshes don't trigger the event again, so both are needed.
      registration.addEventListener("updatefound", () => {
        setWaiting(true);
      });
      if (registration.waiting) {
        setWaiting(true);
      }
    });

    navigator.serviceWorker.ready.then(() => {
      setReady(true);
    });
  }, []);

  async function upgrade() {
    // This uses direct communication to the worker instead of the broadcast
    // channel because we only want to communicate with the waiting worker
    const registration = await navigator.serviceWorker.ready;
    if (registration.waiting) {
      registration.waiting.addEventListener("statechange", (event) => {
        const state = (event.target as ServiceWorker)?.state || "";
        if (state === "activated") {
          window.location.reload();
        }
      });

      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      // This case shouldn't really happen, but just in case, make it look like
      // the button does something
      setWaiting(false);
      window.location.reload();
    }
  }

  return (
    <ServiceWorkerContext.Provider value={{ ready }}>
      {waiting && <button onClick={upgrade}>Restart</button>}
      {children}
    </ServiceWorkerContext.Provider>
  );
}

export function useServiceWorker() {
  return React.useContext(ServiceWorkerContext);
}
