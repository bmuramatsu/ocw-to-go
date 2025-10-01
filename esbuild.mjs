import esbuild from "esbuild";
// We're using this for postcss, but it can do SASS and others
import stylePlugin from "esbuild-style-plugin";
// This adds reasonable defaults for backwards compatibility with older browsers
import postCssEnv from "postcss-preset-env";

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
  plugins: [stylePlugin({ postcss: { plugins: [postCssEnv()] } })],
  minify: false,
  sourcemap: true,
  target: "es2017",
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
