// 로컬 테스트 전용 서버. Vercel CLI 로그인 없이도 api/*.js 핸들러와 정적 파일을
// 함께 띄워서 카드 1~5 흐름을 확인하기 위한 것. 실제 배포는 Vercel이 담당하며,
// 인증 로직은 전부 api/ 아래 파일에만 있다 — 이 파일은 그걸 로컬에서 부르는 껍데기일 뿐.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PORT = process.env.PORT || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return undefined;
  const raw = Buffer.concat(chunks).toString("utf8");
  const type = req.headers["content-type"] || "";
  if (type.includes("application/json")) {
    try {
      return JSON.parse(raw);
    } catch {
      return undefined;
    }
  }
  return raw;
}

function decorateResponse(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (obj) {
    if (!res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.end(JSON.stringify(obj));
    return res;
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/api/")) {
    const name = url.pathname.replace("/api/", "").split("/")[0];
    const modPath = path.join(ROOT, "api", `${name}.js`);
    if (!fs.existsSync(modPath)) return send(res, 404, "Not found");

    try {
      req.body = await readBody(req);
      req.query = Object.fromEntries(url.searchParams.entries());
      decorateResponse(res);
      // 캐시 무력화: 편집 후 재요청하면 최신 코드가 반영되도록.
      const mod = await import(`${pathToFileURL(modPath).href}?t=${Date.now()}`);
      await mod.default(req, res);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        send(res, 500, JSON.stringify({ error: String(err && err.message ? err.message : err) }), {
          "Content-Type": "application/json",
        });
      }
    }
    return;
  }

  let filePath = path.join(ROOT, decodeURIComponent(url.pathname));
  if (url.pathname === "/") filePath = path.join(ROOT, "index.html");
  if (!filePath.startsWith(ROOT)) return send(res, 403, "Forbidden");
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return send(res, 404, "Not found");
  }
  const ext = path.extname(filePath);
  send(res, 200, fs.readFileSync(filePath), { "Content-Type": MIME[ext] || "application/octet-stream" });
});

server.listen(PORT, () => {
  console.log(`로컬 테스트 서버: http://localhost:${PORT}`);
});
