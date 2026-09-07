import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { getRp } from "./_lib/rp.js";
import {
  ensureUser,
  saveUser,
  consumeChallenge,
  assertValidUsername,
  createSession,
  SESSION_TTL,
} from "./_lib/users.js";
import { setSessionCookie } from "./_lib/cookies.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST만 허용" });
  try {
    const { username, passkeyName, attestationResponse } = req.body || {};
    assertValidUsername(username);
    if (!attestationResponse) {
      return res.status(400).json({ error: "attestationResponse가 없습니다." });
    }

    // 읽는 즉시 지운다 — 등록 확인이 끝나면 같은 challenge는 다시 쓸 수 없다.
    const expectedChallenge = await consumeChallenge("reg", username);
    if (!expectedChallenge) {
      return res.status(400).json({ error: "등록용 질문이 없거나 이미 사용됨(또는 만료됨)." });
    }

    const { rpID, origin } = getRp(req);
    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: attestationResponse,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });
    } catch {
      // attestationResponse 형식이 아예 깨져 있는 경우도 "검증 실패"로 취급한다.
      // 이 경우도 아래 credential 저장 코드에는 도달하지 않으므로 서버에 아무것도 남지 않는다.
      verification = { verified: false };
    }

    if (!verification.verified || !verification.registrationInfo) {
      // 등록 실패 시 서버에 아무것도 저장하지 않는다 (T08-C25의 취소 케이스와 동일한 결과).
      return res.status(400).json({ error: "등록 검증에 실패했습니다." });
    }

    // registrationInfo.credential.publicKey에는 "공개키"만 들어 있다.
    // 개인키는 기기(authenticator) 밖으로 나온 적이 없으므로 이 요청 본문 어디에도 없다 (T08-C23).
    const { credential } = verification.registrationInfo;
    const user = await ensureUser(username);

    if (user.credentials.some((c) => c.id === credential.id)) {
      return res.status(409).json({ error: "이미 등록된 패스키입니다." });
    }

    const publicKeyB64 = Buffer.from(credential.publicKey).toString("base64url");

    user.credentials.push({
      id: credential.id,
      publicKey: publicKeyB64, // 서버에 저장되는 값 = 공개키 (비밀번호 아님, T08-C22)
      counter: credential.counter,
      transports: credential.transports || [],
      name: (passkeyName && String(passkeyName).slice(0, 40)) || `passkey-${user.credentials.length + 1}`,
      createdAt: Date.now(),
    });
    await saveUser(user);

    // 등록에 성공했다는 것 자체가 "이 기기로 방금 인증했다"는 뜻이므로 바로 로그인 처리한다
    // (비밀번호 없이도 등록=최초 로그인이 되는 자연스러운 흐름).
    const token = await createSession(username);
    setSessionCookie(req, res, token, SESSION_TTL);

    res.status(200).json({
      ok: true,
      passkeyCount: user.credentials.length,
      storedPublicKeyPreview: `${publicKeyB64.slice(0, 24)}...`,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
