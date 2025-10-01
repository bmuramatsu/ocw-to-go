import esbuild from "esbuild";
import fs from "fs";

const [env] = process.argv.slice(2);

const entryPoints = [
  "src/app.tsx",
  "src/course.ts",
  "src/styles.css",
  "src/course-styles.css",
  "src/video-downloader-styles.css",
];

const config = {
  bundle: true,
  minify: false,
  sourcemap: true,
  target: ["es2017", "chrome58"],
  outdir: "dist",
  format: "iife",
  logLevel: "info",
};

const DevManifest = {
  "/app.tsx": "/app.js",
  "/styles.css": "/styles.css",
  "/course.ts": "/course.js",
  "/video-downloader-styles.css": "/video-downloader-styles.css",
  "/course-styles.css": "/course-styles.css",
};

async function build() {
  if (env === "dev") {
    resetDist();
    makeIndexHtml(DevManifest);
    copyStaticFiles();

    const ctx = await esbuild.context({
      ...config,
      entryPoints: [...entryPoints, "src/worker.ts"],
      define: {
        // This will technically be available to the app scripts, but should only be used by the worker.
        WORKER_ASSET_MANIFEST: JSON.stringify(DevManifest),
      },
    });
    await ctx.watch();
  } else {
    resetDist();
    copyStaticFiles();

    const buildResult = await esbuild.build({
      ...config,
      entryPoints,
      entryNames: "[name]-[hash]",
      minify: true,
      sourcemap: false,
      metafile: true,
    });

    const { outputs } = buildResult.metafile;

    const buildManifest = {};
    // entries look like {"dist/app-ABC123.js": { entryPoint: "src/app.tsx" } }
    for (let outPath of Object.keys(outputs)) {
      const inPath = outputs[outPath].entryPoint.replace(/^src/, "");
      outPath = outPath.replace(/^dist/, "");
      buildManifest[inPath] = outPath;
    }

    makeIndexHtml(buildManifest);

    await esbuild.build({
      ...config,
      entryPoints: ["src/worker.ts"],
      minify: true,
      sourcemap: false,
      define: {
        WORKER_ASSET_MANIFEST: JSON.stringify(buildManifest),
      },
    });
  }
}

function resetDist() {
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true });
  }
  fs.mkdirSync("dist");
}

function makeIndexHtml(manifest) {
  let index = fs.readFileSync("src/index.html", "utf8");
  index = index.replace("__APP_JS__", manifest["/app.tsx"]);
  index = index.replace("__STYLES_CSS__", manifest["/styles.css"]);
  index = index.replace("__ASSET_MANIFEST__", JSON.stringify(manifest));
  fs.writeFileSync("dist/index.html", index);
}

function copyStaticFiles() {
  fs.cpSync("static", "dist", { recursive: true });
}

await build();
