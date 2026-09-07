import { parseCookies, SESSION_COOKIE, clearSessionCookie } from "./_lib/cookies.js";
import { destroySession } from "./_lib/users.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST만 허용" });
  const cookies = parseCookies(req);
  // 서버 저장소에서 세션을 지운다 — 이후 같은 쿠키 값으로 다시 요청해도 거절된다 (T08-C33).
  await destroySession(cookies[SESSION_COOKIE]);
  clearSessionCookie(req, res);
  res.status(200).json({ ok: true });
}
