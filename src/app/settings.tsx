import React from "react";
import { useLocation } from "wouter";

async function resetApp() {
  const workers = await navigator.serviceWorker.getRegistrations();
  const unregistrations = workers.map(async (registration) => {
    return registration.unregister();
  });

  await Promise.all(unregistrations);
}

async function resetStorage() {
  const cacheKeys = await caches.keys();
  const deletions = cacheKeys.map((key) => {
    return caches.delete(key);
  });

  await Promise.all(deletions);

  localStorage.clear();
}

// Secret page used to reset the app
export default function Settings() {
  const [, navigate] = useLocation();
  const [shouldResetApp, setShouldResetApp] = React.useState(true);
  const [shouldResetData, setShouldResetData] = React.useState(true);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (shouldResetApp) {
      await resetApp();
    }

    if (shouldResetData) {
      await resetStorage();
    }

    navigate("/");
    window.location.reload();
  }

  return (
    <main>
      <div className="main__contain">
        <form onSubmit={onSubmit}>
          <h1>Reset App</h1>
          <div>
            <label>
              <input
                type="checkbox"
                checked={shouldResetApp}
                onChange={(e) => setShouldResetApp(e.target.checked)}
              />
              Reset application code and assets?
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={shouldResetData}
                onChange={(e) => setShouldResetData(e.target.checked)}
              />
              Clear courses and videos?
            </label>
          </div>
          <button type="submit" disabled={!shouldResetApp && !shouldResetData}>
            Reset
          </button>
        </form>
      </div>
    </main>
  );
}
