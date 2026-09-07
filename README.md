# WHITECLOVER Portfolio

Security-minded Full-Stack Developer 개인 포트폴리오 페이지. 빌드 도구 없이 순수 HTML/CSS/JS로 만든 정적 원페이지 사이트입니다.

**🔗 https://whiteclover0542.github.io/make_portfolio/**

## 소개

함께 협업할 팀원들에게 "제가 누구인지"를 보여주기 위해 만든 페이지입니다. AI/LLM 기반 딥보이스(음성 딥페이크) 탐지, RAG, 안전성 검증 등 프로젝트 경험을 중심으로 구성했습니다.

- **WHO AM I / WHAT I DO / PROOF** — 첫 화면에서 3초 안에 포지셔닝과 핵심 지표(EER 0.98%, 위기 감지 40/40, G-Eval 4.6–4.8)를 보여줍니다.
- **WORK & SKILLS** — GitHub, 기술 스택, 보안 관점 소개.
- **HOW I WORK** — 상황·행동·결과(STAR) 형식으로 정리한 강점 3가지, 각 항목에 근거 자료를 토글로 연결.
- **PROJECTS** — Deepfake Detection AI, Emotion Check-in AI, SafeMaintAI 3개 프로젝트를 Problem·Role·Result·Tech·GitHub 링크로 소개.

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript (프레임워크·빌드 과정 없음)
- Google Fonts (Black Han Sans, Gowun Dodum, Noto Sans KR)
- GitHub Pages 배포

## 로컬에서 보기

별도 빌드 과정이 없으므로 `index.html`을 브라우저로 바로 열거나, 로컬 서버로 띄워서 확인합니다.

```bash
npx serve .
# 또는
python -m http.server 8000
```

## 파일 구조

```
index.html   페이지 본문/구조
style.css    스타일
script.js    "자세히 보기" 토글 인터랙션
```

## 문서

과제별 문서는 `과제N/` 폴더에 모아둡니다.

### 과제1 — 포트폴리오 페이지

- [검증안내서.md](과제1/검증안내서.md) — 페이지 확인 방법과 통과 기준
- [공개비공개점검표.md](과제1/공개비공개점검표.md) — 공개 대상 문장 및 공개/비공개 정보 기준
- [AI3줄.md](과제1/AI3줄.md) — 이 프로젝트에서 AI 활용 내역 요약
- [progress.md](과제1/progress.md) — 제작 진행 관리 기록

### 과제8 — 패스키(WebAuthn) 인증

- **결과물**: https://makeportfolio-red.vercel.app
- [ASSIGNMENT.md](과제8/ASSIGNMENT.md) — 과제 지침·요구사항 원문
- [인증구현설명서.md](과제8/인증구현설명서.md) — 무엇으로·왜·어디를·확인 기록·아직 못 막은 것
- [검증안내서.md](과제8/검증안내서.md) — 페이지 확인 방법과 통과 기준
- [AI3줄.md](과제8/AI3줄.md) — AI 활용 내역 요약
- [progress.md](과제8/progress.md) — 카드별 체크리스트·작업 순서·진행 기록
- [evidence/](과제8/evidence/), [evidence-prod/](과제8/evidence-prod/) — 로컬/배포 주소 자동 검증 스크린샷·요청응답 로그

## 배포

GitHub Pages(main 브랜치 루트)로 배포되며, 커밋 시 자동 반영됩니다.
