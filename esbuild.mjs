import esbuild from "esbuild";

const [env] = process.argv.slice(2);

const config = {
  entryPoints: [
    "src/app.tsx",
    "src/course.ts",
    "src/worker.ts",
    "src/styles.css",
    "src/course-styles.css",
    "src/video-downloader-styles.css",
  ],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: ["es2017", "chrome58"],
  outdir: "dist",
  format: "iife",
  logLevel: "info",
};

if (env === "dev") {
  const ctx = await esbuild.context(config);
  await ctx.watch();
} else {
  await esbuild.build({ ...config, minify: true, sourcemap: false });
}
