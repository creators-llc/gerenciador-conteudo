import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            // Chamada '/api', o Vite redireciona para o Backend 
            '/api': {
                target: 'https://creators-agent-backend-667882323038.us-central1.run.app',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
