import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';
import path from "node:path";
import process from "node:process";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@/': path.resolve(process.cwd(), 'src'),
            '@/app': path.resolve(process.cwd(), 'src/app'),
            '@/components': path.resolve(process.cwd(), 'src/components'),
            "@/ducks": path.resolve(process.cwd(), 'src/ducks'),
            '@/slices': path.resolve(process.cwd(), 'src/slices'),
            "@/src": path.resolve(process.cwd(), 'src'),
            "@/types": path.resolve(process.cwd(), 'src/types'),
        }
    },
    base: "/apps/job-postings/",
    build: {
        manifest: true,
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                    if (id.includes('src/components')) {
                        return 'components';
                    }
                }
            }
        }
    },
    server: {
        port: 8080,
        host: 'localhost',
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            }
        }
    }
})
