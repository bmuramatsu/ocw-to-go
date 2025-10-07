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
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    navigator.serviceWorker.ready.then(() => {
      setReady(true);
    });
  }, []);

  return (
    <ServiceWorkerContext.Provider value={{ ready }}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}

export function useServiceWorker() {
  return React.useContext(ServiceWorkerContext);
}
