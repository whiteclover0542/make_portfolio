import { kvGet, kvSet, kvDel } from "./store.js";

const USER_PREFIX = "user:";
const CHALLENGE_PREFIX = "challenge:";
const SESSION_PREFIX = "session:";

export const CHALLENGE_TTL = 60 * 5; // 5분 — 이 시간이 지나면 challenge는 자동 소멸
export const SESSION_TTL = 60 * 60; // 1시간

function isValidUsername(username) {
  return typeof username === "string" && /^[a-zA-Z0-9_-]{2,32}$/.test(username);
}

function defaultPrivateNotes(username) {
  // 실제 개인정보 아님 — 과제 제출용으로 만들어 넣은(더미) 자리표시 항목.
  return [
    { id: "note-1", text: `[더미] ${username}의 준비 중인 프로젝트 메모 — "딥페이크 탐지 v2 아이디어 정리 중"` },
    { id: "note-2", text: `[더미] ${username}의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)` },
    { id: "note-3", text: `[더미] ${username}의 이번 달 회고 — "패스키 과제로 WebAuthn 흐름을 직접 구현해봄"` },
  ];
}

export function assertValidUsername(username) {
  if (!isValidUsername(username)) {
    const err = new Error("username은 영문/숫자/-/_ 2~32자여야 합니다.");
    err.statusCode = 400;
    throw err;
  }
}

export async function getUser(username) {
  return (await kvGet(USER_PREFIX + username)) || null;
}

export async function ensureUser(username) {
  let user = await getUser(username);
  if (!user) {
    user = {
      username,
      credentials: [],
      privateNotes: defaultPrivateNotes(username),
      createdAt: Date.now(),
    };
    await kvSet(USER_PREFIX + username, user);
  }
  return user;
}

export async function saveUser(user) {
  await kvSet(USER_PREFIX + user.username, user);
}

export async function setChallenge(kind, username, challenge) {
  await kvSet(`${CHALLENGE_PREFIX}${kind}:${username}`, challenge, CHALLENGE_TTL);
}

// 읽는 즉시 지운다 — 같은 challenge로 두 번 다시 통과하지 못하게 하는 핵심 지점.
export async function consumeChallenge(kind, username) {
  const key = `${CHALLENGE_PREFIX}${kind}:${username}`;
  const value = await kvGet(key);
  if (value) await kvDel(key);
  return value;
}

export async function createSession(username) {
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
  await kvSet(SESSION_PREFIX + token, { username, createdAt: Date.now() }, SESSION_TTL);
  return token;
}

export async function getSession(token) {
  if (!token) return null;
  return await kvGet(SESSION_PREFIX + token);
}

export async function destroySession(token) {
  if (!token) return;
  await kvDel(SESSION_PREFIX + token);
}
