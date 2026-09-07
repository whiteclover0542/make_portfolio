// Relying Party(RP) 설정: 배포 도메인이 매번 달라질 수 있어(프리뷰 URL 포함)
// 요청 헤더에서 자동으로 유도한다. 커스텀 도메인을 고정하고 싶으면
// Vercel 프로젝트 환경변수에 RP_ID / ORIGIN을 넣으면 그 값이 우선한다.
export function getRp(req) {
  if (process.env.RP_ID && process.env.ORIGIN) {
    return {
      rpID: process.env.RP_ID,
      origin: process.env.ORIGIN,
      rpName: process.env.RP_NAME || "WHITECLOVER Portfolio",
    };
  }
  const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const hostname = String(host).split(":")[0];
  return {
    rpID: hostname,
    origin: `${proto}://${host}`,
    rpName: process.env.RP_NAME || "WHITECLOVER Portfolio",
  };
}
