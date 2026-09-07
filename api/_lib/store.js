// 아주 단순한 키-값 저장소 래퍼.
// - 배포 환경(Vercel)에서 UPSTASH_REDIS_REST_URL / TOKEN(또는 Vercel Marketplace가
//   자동으로 주입하는 KV_REST_API_URL / KV_REST_API_TOKEN)이 있으면 Upstash Redis를 쓴다.
// - 로컬 개발(env 없음)에서는 프로젝트 루트의 .data/db.json 파일에 저장한다(과제용,
//   서버리스 다중 인스턴스 환경에서는 쓰지 않을 것 — vercel dev 단일 프로세스 로컬 테스트 전용).
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "..", "..", ".data", "db.json");

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const backend = redisUrl && redisToken ? "redis" : "local-file";
const redis = backend === "redis" ? new Redis({ url: redisUrl, token: redisToken }) : null;

function loadLocal() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveLocal(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function localGet(key) {
  const db = loadLocal();
  const entry = db[key];
  if (!entry) return null;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    delete db[key];
    saveLocal(db);
    return null;
  }
  return entry.value;
}

function localSet(key, value, exSeconds) {
  const db = loadLocal();
  db[key] = {
    value,
    expiresAt: exSeconds ? Date.now() + exSeconds * 1000 : null,
  };
  saveLocal(db);
}

function localDel(key) {
  const db = loadLocal();
  delete db[key];
  saveLocal(db);
}

export async function kvGet(key) {
  if (backend === "redis") {
    const v = await redis.get(key);
    return v ?? null;
  }
  return localGet(key);
}

export async function kvSet(key, value, exSeconds) {
  if (backend === "redis") {
    if (exSeconds) {
      await redis.set(key, value, { ex: exSeconds });
    } else {
      await redis.set(key, value);
    }
    return;
  }
  localSet(key, value, exSeconds);
}

export async function kvDel(key) {
  if (backend === "redis") {
    await redis.del(key);
    return;
  }
  localDel(key);
}

export function storageBackend() {
  return backend;
}
