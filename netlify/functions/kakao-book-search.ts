// Netlify Serverless Function — 카카오(다음) 책 검색 API 프록시
// 네이버 책 검색 API는 2026-07-31 종료되어 카카오 책 검색으로 대체.
// 환경변수 KAKAO_REST_API_KEY 는 Netlify 대시보드에 등록 (브라우저에 노출되지 않음)

interface NetlifyEvent {
  queryStringParameters?: Record<string, string> | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=300",
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const query = (event.queryStringParameters?.query ?? "").trim();
  const size = Math.min(50, Math.max(1, Number(event.queryStringParameters?.size) || 50));

  if (!query) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "query is required" }) };
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    // 키가 없으면 클라이언트가 Google Books로 대체 검색
    return { statusCode: 503, headers: HEADERS, body: JSON.stringify({ error: "not_configured" }) };
  }

  const url = `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(query)}&size=${size}`;
  const res = await fetch(url, { headers: { Authorization: `KakaoAK ${apiKey}` } });

  return { statusCode: res.status, headers: HEADERS, body: await res.text() };
};
