export default async function downloadWithProgress(
  path: string,
  callback: (progress: number, total: number) => void,
): Promise<Blob> {
  let interval: number | undefined;

  try {
    const resp = await fetch(path);

    const chunks: Uint8Array[] = [];
    const total = Number(resp.headers.get("Content-Length"));
    let progress = 0;

    callback(progress, total);
    interval = setInterval(() => {
      callback(progress,total);
    }, 300);

    const reader = resp.body!.getReader();
    while (true) {
      const { done, value: chunk } = await reader.read();

      if (done) break;

      chunks.push(chunk);
      progress += chunk.length;
    }

    return new Blob(chunks);
  } finally {
    clearInterval(interval);
  }
}
