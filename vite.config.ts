import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_ 접두사 없는 변수도 로드 (API 키는 브라우저에 노출되지 않도록 비접두사 사용)
  const env = loadEnv(mode, process.cwd(), "");

  // 개발 환경 이미지 프록시 — 외부 이미지 CORS 우회 (Netlify Function과 동일 역할)
  const imageProxyPlugin: Plugin = {
    name: "image-proxy",
    configureServer(server) {
      server.middlewares.use("/api/image-proxy", async (req, res) => {
        const qs = req.url?.split("?")[1] || "";
        const urlParam = new URLSearchParams(qs).get("url");
        if (!urlParam) {
          res.statusCode = 400;
          res.end("Missing url");
          return;
        }
        try {
          const response = await fetch(urlParam);
          const buffer = await response.arrayBuffer();
          res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(Buffer.from(buffer));
        } catch {
          res.statusCode = 500;
          res.end("Failed to fetch image");
        }
      });
    },
  };

  return {
    base: "/",
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        // /api/kakao-book-search → 카카오 책 검색 (Netlify Function과 동일 역할)
        // API 키는 Node.js 프록시 서버에서만 추가되며 브라우저에 노출되지 않음
        "/api/kakao-book-search": {
          target: "https://dapi.kakao.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/kakao-book-search/, "/v3/search/book"),
          headers: {
            Authorization: `KakaoAK ${env.KAKAO_REST_API_KEY || ""}`,
          },
        },
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      imageProxyPlugin,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
