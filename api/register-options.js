import { generateRegistrationOptions } from "@simplewebauthn/server";
import { getRp } from "./_lib/rp.js";
import { ensureUser, setChallenge, assertValidUsername } from "./_lib/users.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST만 허용" });
  try {
    const { username } = req.body || {};
    assertValidUsername(username);

    const { rpID, rpName } = getRp(req);
    const user = await ensureUser(username);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: username,
      userDisplayName: username,
      attestationType: "none",
      // 이미 등록된 패스키는 다시 등록 후보에서 제외 (카드4: 여러 개 등록 지원)
      excludeCredentials: user.credentials.map((c) => ({
        id: c.id,
        transports: c.transports,
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    // 서버가 확인할 때까지 challenge 보관 (T08-C19). 요청마다 새 값 (T08-C20).
    await setChallenge("reg", username, options.challenge);

    res.status(200).json(options);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
