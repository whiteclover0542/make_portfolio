import { parseCookies, SESSION_COOKIE } from "./_lib/cookies.js";
import { getSession } from "./_lib/users.js";

// 로그인 상태 조회용. 보호 자원이 아니므로 200으로 응답하되 loggedIn 값으로 구분한다.
// 실제 비공개 자료는 이 엔드포인트가 아니라 /api/private, /api/passkeys 에서 401/403으로 막는다.
export default async function handler(req, res) {
  const cookies = parseCookies(req);
  const session = await getSession(cookies[SESSION_COOKIE]);
  if (!session) return res.status(200).json({ loggedIn: false });
  res.status(200).json({ loggedIn: true, username: session.username });
}
