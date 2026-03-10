// Netlify Serverless Function — 네이버 책 검색 API 프록시
// 환경변수 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 은 Netlify 대시보드에 등록

interface NetlifyEvent {
  queryStringParameters?: Record<string, string> | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };

  const query = event.queryStringParameters?.query ?? "";
  const display = event.queryStringParameters?.display ?? "100";

  if (!query.trim()) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "query is required" }),
    };
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "API credentials not configured" }),
    };
  }

  const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=${display}`;

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  });

  const body = await res.text();

  return {
    statusCode: res.status,
    headers: CORS_HEADERS,
    body,
  };
};
