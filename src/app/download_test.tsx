import React from "react";

export default function DownloadTest() {
  // https://stackoverflow.com/a/63946003
  async function download() {
    const resp = await caches.match(
      "/courses/local-1/static_resources/mit6_100l_f22_lec01.pdf",
    );
    const blob = await resp!.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "test.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  return <button onClick={download}>Test download</button>;
}
