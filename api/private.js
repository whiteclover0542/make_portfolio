import { requireSession } from "./_lib/require-session.js";
import { getUser } from "./_lib/users.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "GET만 허용" });

  const session = await requireSession(req, res); // 세션 없으면 여기서 401 응답하고 null 반환
  if (!session) return;

  // 주의: req.query나 req.body에 username이 들어와도 절대 읽지 않는다.
  // "누구의 자료를 줄지"는 오직 세션(쿠키)에서 나온 session.username 하나뿐이다.
  // 이 한 줄이 T08-C40(다른 계정 지정해도 내 자료만 옴)을 만드는 지점이다.
  const user = await getUser(session.username);

  res.status(200).json({
    username: session.username,
    notes: user?.privateNotes || [],
  });
}
