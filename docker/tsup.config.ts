import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/main.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs',],
    dts: false,
    clean: true,
    splitting: false,
    sourcemap: false,
    minify: true,
    treeshake: true,
})
