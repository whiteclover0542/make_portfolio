import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { getRp } from "./_lib/rp.js";
import { getUser, setChallenge, assertValidUsername } from "./_lib/users.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST만 허용" });
  try {
    const { username } = req.body || {};
    assertValidUsername(username);

    const { rpID } = getRp(req);
    const user = await getUser(username);

    if (!user || user.credentials.length === 0) {
      return res.status(404).json({ error: "이 계정에 등록된 패스키가 없습니다." });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      // 이 계정 소유의 패스키만 허용 목록에 넣는다 — 다른 계정 패스키는 애초에 후보에 없다.
      allowCredentials: user.credentials.map((c) => ({ id: c.id, transports: c.transports })),
      userVerification: "preferred",
    });

    // 로그인용 challenge도 매번 새로 생성해서 보관 (T08-C27, T08-C28)
    await setChallenge("login", username, options.challenge);

    res.status(200).json(options);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
