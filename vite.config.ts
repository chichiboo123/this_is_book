import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_ 접두사 없는 변수도 로드 (API 키는 브라우저에 노출되지 않도록 비접두사 사용)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        // /api/naver/* → https://openapi.naver.com/*
        // API 키는 Node.js 프록시 서버에서만 추가되며 브라우저에 노출되지 않음
        "/api/naver": {
          target: "https://openapi.naver.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/naver/, ""),
          headers: {
            "X-Naver-Client-Id": env.NAVER_CLIENT_ID || "",
            "X-Naver-Client-Secret": env.NAVER_CLIENT_SECRET || "",
          },
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
