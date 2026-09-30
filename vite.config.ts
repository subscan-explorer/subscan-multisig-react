import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const polkadotUiPackages = [
  'react-api',
  'react-components',
  'react-hooks',
  'react-params',
  'react-query',
  'react-signer',
];

const packageAlias = Object.fromEntries(
  polkadotUiPackages.map((name) => [`@polkadot/${name}`, path.resolve(__dirname, `src/packages/${name}/src`)])
);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    sourcemap: false,
  },
  resolve: {
    alias: [
      { find: '@polkadot/x-rxjs/operators', replacement: 'rxjs/operators' },
      { find: '@polkadot/x-rxjs', replacement: 'rxjs' },
      { find: 'buffer', replacement: path.resolve(__dirname, 'node_modules/buffer') },
      { find: 'process', replacement: path.resolve(__dirname, 'node_modules/process/browser.js') },
      { find: 'src', replacement: path.resolve(__dirname, 'src') },
      ...Object.entries(packageAlias).map(([find, replacement]) => ({ find, replacement })),
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        math: 'always',
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3008,
  },
});
