import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
    {
        ignores: [
            "**/node_modules/**",
            "**/.next/**",
            "**/dist/**",
            "**/build/**",
            "android/**",
            "mobile-app/**",
            "apps/mobile/**",
            "tmp/**",
        ],
    },
    {
        extends: [...nextCoreWebVitals],
    },
]);