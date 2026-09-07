import { parseCookies, SESSION_COOKIE } from "./cookies.js";
import { getSession } from "./users.js";

// 보호된 엔드포인트 공통 진입점. 세션이 없거나 만료됐으면 401을 보내고 null을 돌려준다.
// 반환하는 session.username이 "내가 누구인지"의 유일한 출처다 — 요청 쿼리/바디의 username은
// private.js / passkeys.js 어디에서도 신원 판단에 쓰지 않는다(다른 계정 지정 우회 방지).
export async function requireSession(req, res) {
  const cookies = parseCookies(req);
  const session = await getSession(cookies[SESSION_COOKIE]);
  if (!session) {
    res.status(401).json({ error: "로그인이 필요합니다 (패스키 인증 필요)." });
    return null;
  }
  return session; // { username, createdAt }
}
