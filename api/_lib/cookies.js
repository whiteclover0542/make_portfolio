export const SESSION_COOKIE = "pk_session";

export function parseCookies(req) {
  const header = req.headers.cookie;
  const out = {};
  if (!header) return out;
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  });
  return out;
}

function isHttps(req) {
  return String(req.headers["x-forwarded-proto"] || "").includes("https");
}

export function setSessionCookie(req, res, token, maxAgeSeconds) {
  const secure = isHttps(req) ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`
  );
}

export function clearSessionCookie(req, res) {
  const secure = isHttps(req) ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
  );
}
