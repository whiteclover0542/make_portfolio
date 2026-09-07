import { requireSession } from "./_lib/require-session.js";
import { getUser, saveUser } from "./_lib/users.js";

export default async function handler(req, res) {
  const session = await requireSession(req, res);
  if (!session) return;

  // 여기서도 마찬가지로 session.username만 신원의 출처로 쓴다.
  const user = await getUser(session.username);
  if (!user) return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });

  if (req.method === "GET") {
    return res.status(200).json({
      passkeys: user.credentials.map((c) => ({
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        publicKeyPreview: `${c.publicKey.slice(0, 24)}...`,
      })),
    });
  }

  if (req.method === "DELETE") {
    const { id } = req.body || {};
    const before = user.credentials.length;
    user.credentials = user.credentials.filter((c) => c.id !== id);
    if (user.credentials.length === before) {
      return res.status(404).json({ error: "해당 패스키를 찾을 수 없습니다." });
    }
    await saveUser(user);
    // remaining이 0이어도 삭제는 허용한다 — 대신 프런트에서 삭제 전 경고를 보여주고
    // "패스키가 하나도 없으면 어떻게 되는지"를 문서(인증 구현 설명서)에 남긴다 (T08-C46).
    return res.status(200).json({ ok: true, remaining: user.credentials.length });
  }

  res.status(405).json({ error: "GET/DELETE만 허용" });
}
