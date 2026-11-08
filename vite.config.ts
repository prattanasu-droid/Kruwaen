import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath,URL} from 'node:url';

const repository=process.env.GITHUB_REPOSITORY?.split('/')[1];
const pagesBase=process.env.GITHUB_PAGES==='true'&&repository&&!repository.endsWith('.github.io')?`/${repository}/`:'/';
export default defineConfig({
  base:process.env.GITHUB_PAGES_BASE||pagesBase,
  plugins:[react(),tailwindcss()],
  resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}},
  build:{outDir:'dist',emptyOutDir:true}
});
