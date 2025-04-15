import React from "react";
import JSZip from "jszip";

export default function Share() {
  const [dataURL, setDataURL] = React.useState<string | null>(null);
  const courseID = "23d385b4-4328-4fb0-b398-f5ca46ecae9a";

  const makeExport = React.useCallback(async () => {
    const zip = new JSZip();
    zip.file("index.html", "<h1>Hello World</h1>");
    zip.file("__metadata.json", `{"courseId": "${courseID}"}`);
    const blob = await zip.generateAsync({ type: "blob" });
    setDataURL(URL.createObjectURL(blob));
  }, []);

  const doImport = React.useCallback(async (e: React.FormEvent) => {
    const el = e.target as HTMLInputElement;
    const file = el.files ? el.files[0] : null;
    if (file) {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const metadata = await zipContent.file("__metadata.json")?.async("text");
      console.log(metadata);
    }
  }, []);

  return (
    <main>
      <h1>Share</h1>
      <button onClick={makeExport}>Export</button>
      {dataURL && (
        <a download={`export-${courseID}.zip`} href={dataURL}>
          Download
        </a>
      )}

      <h1>Import</h1>
      <input type="file" onChange={doImport} />
    </main>
  );
}
