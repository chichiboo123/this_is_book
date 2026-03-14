// 외부 이미지를 서버 사이드에서 중계하여 CORS 문제를 해결하는 Netlify Function
// html-to-image가 외부 CDN 이미지를 캔버스에 그릴 때 CORS 오류를 방지

interface NetlifyEvent {
  queryStringParameters?: Record<string, string> | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  isBase64Encoded?: boolean;
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const url = event.queryStringParameters?.url;

  if (!url) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing url parameter" }),
    };
  }

  const res = await fetch(url);
  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to fetch image" }),
    };
  }

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/jpeg";

  return {
    statusCode: 200,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
    body: Buffer.from(buffer).toString("base64"),
    isBase64Encoded: true,
  };
};
