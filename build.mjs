import esbuild from "esbuild";
import fs from "fs";

// We use esbuild to bundle the js and css files. The build process is
// complicated by the fact that we add hash suffixes to assets (to prevent
// caching issues). Therefore, the index.html file and scripts cannot refer to
// fixed filenames. This manifest needs to 1) replace paths in the index.html
// file 2) Add the full manifest as json into the index.html so the app can look
// it up and 3) inject the manifest as a constant into the web worker script.

// In dev mode, the manifest is static, since we aren't worried about caching
// there. In prod mode, the build must be done in multiple phases. First we
// generate the main app file and css files, generate the manifest from that,
// rewrite index.html, and then build the worker with the manifest

const [env] = process.argv.slice(2);

// default list does not include the worker because it must be built last in
// prod mode
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

    // In dev, build the worker and assets together with a static manifest
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

// We serve the Dist file. It's ignored by git and cleared out with each build
function resetDist() {
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true });
  }
  fs.mkdirSync("dist");
}

// This does very simple string replacements to the correct file paths
function makeIndexHtml(manifest) {
  let index = fs.readFileSync("src/index.html", "utf8");
  index = index.replace("__APP_JS__", manifest["/app.tsx"]);
  index = index.replace("__STYLES_CSS__", manifest["/styles.css"]);
  index = index.replace("__ASSET_MANIFEST__", JSON.stringify(manifest));
  fs.writeFileSync("dist/index.html", index);
}

// All static assets should go in the static folder. They will be erased from dist
function copyStaticFiles() {
  fs.cpSync("static", "dist", { recursive: true });
}

await build();
