import React from "react";

function useAppUpgrade() {
  const [waiting, setWaiting] = React.useState(false);

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
  });

  return { upgradeAvailable: waiting };
}

async function upgradeApp() {
  // This uses direct communication to the worker instead of the broadcast
  // channel because we only want to communicate with the waiting worker
  const registration = await navigator.serviceWorker.ready;
  if (registration.waiting) {
    // This event will be triggered when the worker receives the SKIP_WAITING
    // message
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
    window.location.reload();
  }
}

export default function UpgradeBanner() {
  const { upgradeAvailable } = useAppUpgrade();

  if (!upgradeAvailable) return null;

  return (
    <div style={{ backgroundColor: "white" }}>
      Restart to update the app <button onClick={upgradeApp}>Update App</button>
    </div>
  );
}
