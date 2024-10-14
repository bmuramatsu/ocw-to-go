import esbuild from 'esbuild';

const ctx = await esbuild.context({
  entryPoints: ['src/app.tsx', 'src/course.ts', 'src/worker.ts'],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: 'es2017',
  outdir: 'dist',
  format: 'iife',
  logLevel: 'info',
})

await ctx.watch();
