import { defineConfig, loadEnv, type ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }: ConfigEnv) => {
  // load .env file for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL, // this reads from your .env
          changeOrigin: true,
          secure: false,
        },
        '/media': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/media': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
  });
};
