import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          chiSiamo: path.resolve(__dirname, 'chi-siamo.html'),
          touring: path.resolve(__dirname, 'touring.html'),
          formazione: path.resolve(__dirname, 'formazione.html'),
          webapp: path.resolve(__dirname, 'webapp.html'),
          contatti: path.resolve(__dirname, 'contatti.html'),
          puntoDiVista: path.resolve(__dirname, 'punto-di-vista.html'),
          moduliFormativi: path.resolve(__dirname, 'moduli-formativi.html'),
        },
      },
    },
  };
});
