import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { getRp } from "./_lib/rp.js";
import {
  getUser,
  saveUser,
  consumeChallenge,
  createSession,
  assertValidUsername,
  SESSION_TTL,
} from "./_lib/users.js";
import { setSessionCookie } from "./_lib/cookies.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST만 허용" });
  try {
    const { username, assertionResponse } = req.body || {};
    assertValidUsername(username);
    if (!assertionResponse) {
      return res.status(400).json({ error: "assertionResponse가 없습니다." });
    }

    // 읽는 즉시 지운다 — 로그인 성공/실패와 무관하게 같은 challenge는 두 번 쓰지 못한다.
    // 이미 쓴 challenge로 같은 assertionResponse를 재전송하면 여기서 막힌다 (T08-C31).
    const expectedChallenge = await consumeChallenge("login", username);
    if (!expectedChallenge) {
      return res.status(401).json({ error: "로그인용 질문이 없거나 이미 사용됨(또는 만료됨)." });
    }

    const user = await getUser(username);
    if (!user) return res.status(401).json({ error: "사용자를 찾을 수 없습니다." });

    // 이 계정(username)의 패스키 목록에 없는 credential ID면 "남의 패스키" — 여기서 차단.
    const credential = user.credentials.find((c) => c.id === assertionResponse.id);
    if (!credential) {
      return res.status(401).json({ error: "이 계정에 등록된 패스키가 아닙니다." });
    }

    const { rpID, origin } = getRp(req);
    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: assertionResponse,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: credential.id,
          publicKey: Buffer.from(credential.publicKey, "base64url"),
          counter: credential.counter,
          transports: credential.transports,
        },
      });
    } catch {
      verification = { verified: false };
    }

    if (!verification.verified) {
      return res.status(401).json({ error: "서명 검증에 실패했습니다." });
    }

    // 카운터가 뒤로 가면(또는 그대로면서 0이 아니면) 복제된 인증기일 수 있으므로 거절.
    const { newCounter } = verification.authenticationInfo;
    if (credential.counter !== 0 && newCounter !== 0 && newCounter <= credential.counter) {
      return res.status(401).json({ error: "카운터 값이 비정상적입니다 (복제 의심)." });
    }
    credential.counter = newCounter;
    await saveUser(user);

    const token = await createSession(username);
    setSessionCookie(req, res, token, SESSION_TTL);

    res.status(200).json({ ok: true, username });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
