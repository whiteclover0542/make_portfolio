# 패스키 흐름 자동 검증 로그

실행 시각: 2026-09-07T00:40:08.018Z

## 카드1: 로그인 전 페이지 소스에 비공개 내용 포함 여부

```
포함됨(문제) = false (false여야 통과)
```


## 카드1: 비로그인 상태로 /api/private 직접 요청

```
{
  "status": 401,
  "body": {
    "error": "로그인이 필요합니다 (패스키 인증 필요)."
  }
}
```


## 카드2: Alice 패스키#1 등록 상태 메시지

```
패스키 등록 완료 (총 1개). 서버에 저장된 값(공개키): pAEBAycgBiFYICX-LVqtpqIM...
```


## 카드2: Alice 패스키#1 등록 직후 요청 로그

```
[9시 40분 5초] GET /api/passkeys -> 200
  {"passkeys":[{"id":"YxUTdq8hPdsrj_4fzygaVS7i61R3QOYZbEHYUcFIaiA","name":"alice-노트북","createdAt":1788741605827,"publicKeyPreview":"pAEBAycgBiFYICX-LVqtpqIM..."}]}

[9시 40분 5초] GET /api/private -> 200
  {"username":"alice-demo","notes":[{"id":"note-1","text":"[더미] alice-demo의 준비 중인 프로젝트 메모 — \"딥페이크 탐지 v2 아이디어 정리 중\""},{"id":"note-2","text":"[더미] alice-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)"},{"id":"note-3","text":"[더미] alice-demo의 이번 달 회고 — \"패스키 과제로 WebAuthn 흐름을 직접 구현해봄\""}]}

[9시 40분 5초] GET /api/session -> 200
  {"loggedIn":true,"username":"alice-demo"}

[9시 40분 5초] POST /api/register-verify -> 200
  {"ok":true,"passkeyCount":1,"storedPublicKeyPreview":"pAEBAycgBiFYICX-LVqtpqIM..."}

[9시 40분 5초] POST /api/register-options -> 200
  {"challenge":"w0bD2pb7TSbYlfGQDMyCyBBbS5OfyhJQkzq2628FD9A","rp":{"name":"WHITECLOVER Portfolio","id":"localhost"},"user":{"id":"5VSl9WKBWjJIZTkc_z5vZgtJy6Z9zt4KK7ztRG_Ydgc","name":"alice-demo","displayName":"alice-demo"},"pubKeyCredParams":[{"alg":-8,"type":"public-key"},{"alg":-7,"type":"public-key"},{"alg":-257,"type":"public-key"}],"timeout":60000,"attestation":"none","excludeCredentials":[],"authenticatorSelection":{"residentKey":"preferred","userVerification":"preferred","requireResidentKey":false},"extensions":{"credProps":true},"hints":[]}

[9시 40분 4초] GET /api/session -> 200
  {"loggedIn":false}


```


## 카드1: Alice 비공개 메모 (3개 이상)

```
[더미] alice-demo의 준비 중인 프로젝트 메모 — "딥페이크 탐지 v2 아이디어 정리 중"
[더미] alice-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)
[더미] alice-demo의 이번 달 회고 — "패스키 과제로 WebAuthn 흐름을 직접 구현해봄"
```


## 카드2: 등록용 challenge 두 번 요청 비교 (같으면 문제)

```
{
  "challengeA": "m206iwzQOVy_-8PiYPQUyaDDk7ozEZ8AqBUN5OuXyss",
  "challengeB": "3gRwIK_ftCDOKeB-5BirawYLugFHZHCPNovML9dXZ64",
  "same": false
}
```


## 카드2: 등록 취소/위조 시나리오 — 검증 실패 응답과, 그 뒤에도 이 계정에 저장된 패스키가 0개임을 확인

```
{
  "verifyResult": {
    "status": 400,
    "body": {
      "error": "등록 검증에 실패했습니다."
    }
  },
  "credentialSavedCheck": {
    "status": 404,
    "body": {
      "error": "이 계정에 등록된 패스키가 없습니다."
    }
  }
}
```


## 카드4: Alice 패스키#2(폰) 등록 상태

```
패스키 등록 완료 (총 2개). 서버에 저장된 값(공개키): pAEBAycgBiFYIDRJgwKzRJIg...
```


## 카드4: 패스키 목록 (2개, 이름+등록일)

```
alice-노트북 · 2026. 9. 7. 오전 9:40:05 · pAEBAycgBiFYICX-LVqtpqIM...
삭제
```


## 카드4: 삭제 전 /api/passkeys 응답

```
{
  "passkeys": [
    {
      "id": "YxUTdq8hPdsrj_4fzygaVS7i61R3QOYZbEHYUcFIaiA",
      "name": "alice-노트북",
      "createdAt": 1788741605827,
      "publicKeyPreview": "pAEBAycgBiFYICX-LVqtpqIM..."
    },
    {
      "id": "pZkzcvmz787OBh_gt_slvEJKRT8f7DcH5OBlnvHvwdk",
      "name": "alice-폰",
      "createdAt": 1788741606585,
      "publicKeyPreview": "pAEBAycgBiFYIDRJgwKzRJIg..."
    }
  ]
}
```


## 카드3: 로그아웃 직후 /api/session

```
{
  "loggedIn": false
}
```


## 카드3: 로그아웃한 옛 세션 쿠키를 그대로 재사용해 /api/private 요청 (거절되어야 함)

```
{
  "status": 401,
  "body": {
    "error": "로그인이 필요합니다 (패스키 인증 필요)."
  }
}
```


## 카드3: 재로그인 성공 상태

```
alice-demo(으)로 로그인했습니다.
```


## 카드3: 로그인 성공 시점 요청 로그

```
[9시 40분 7초] GET /api/passkeys -> 200
  {"passkeys":[{"id":"YxUTdq8hPdsrj_4fzygaVS7i61R3QOYZbEHYUcFIaiA","name":"alice-노트북","createdAt":1788741605827,"publicKeyPreview":"pAEBAycgBiFYICX-LVqtpqIM..."},{"id":"pZkzcvmz787OBh_gt_slvEJKRT8f7DcH5OBlnvHvwdk","name":"alice-폰","createdAt":1788741606585,"publicKeyPreview":"pAEBAycgBiFYIDRJgwKzRJIg..."}]}

[9시 40분 6초] GET /api/private -> 200
  {"username":"alice-demo","notes":[{"id":"note-1","text":"[더미] alice-demo의 준비 중인 프로젝트 메모 — \"딥페이크 탐지 v2 아이디어 정리 중\""},{"id":"note-2","text":"[더미] alice-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)"},{"id":"note-3","text":"[더미] alice-demo의 이번 달 회고 — \"패스키 과제로 WebAuthn 흐름을 직접 구현해봄\""}]}

[9시 40분 6초] GET /api/session -> 200
  {"loggedIn":true,"username":"alice-demo"}

[9시 40분 6초] POST /api/login-verify -> 200
  {"ok":true,"username":"alice-demo"}

[9시 40분 6초] POST /api/login-options -> 200
  {"rpId":"localhost","challenge":"bVfgrxvyJmkELOnOIRu18Z3y9tI_wOh3ac_w9oDJhrs","allowCredentials":[{"id":"YxUTdq8hPdsrj_4fzygaVS7i61R3QOYZbEHYUcFIaiA","transports":["internal"],"type":"public-key"},{"id":"pZkzcvmz787OBh_gt_slvEJKRT8f7DcH5OBlnvHvwdk","transports":["usb"],"type":"public-key"}],"timeout":60000,"userVerification":"preferred"}

[9시 40분 6초] POST /api/logout -> 200
  {"ok":true}

[9시 40분 6초] GET /api/passkeys -> 200
  {"passkeys":[{"id":"YxUTdq8hPdsrj_4fzygaVS7i61R3QOYZbEHYUcFIaiA","name":"alice-노트북","createdAt":1788741605827,"publicKeyPreview":"pAEBAycgBiFYICX-LVqtpqIM..."},{"id":"pZkzcvmz787OBh_gt_slvEJKRT8f7DcH5OBlnvHvwdk","name":"alice-폰","createdAt":1788741606585,"publicKeyPreview":"pAEBAycgBiFYIDRJgwKzRJIg..."}]}

[9시 40분 6초] GET /api/private -> 200
  {"username":"alice-demo","notes":[{"id":"note-1","text":"[더미] alice-demo의 준비 중인 프로젝트 메모 — \"딥페이크 탐지 v2 아이디어 정리 중\""},{"id":"note-2","text":"[더미] alice-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)"},{"id":"note-3","text":"[더미] alice-demo의 이번 달 회고 — \"패스키 과제로 WebAuthn 흐름을 직접 구현해봄\""}]}

[9시 40분 6초] GET /api/session -> 200
  {"loggedIn":true,"username":"alice-demo"}

[9시 40분 6초] POST /api/register-verify -> 200
  {"ok":true,"passkeyCount":2,"storedPublicKeyPreview":"pAEBAycgBiFYIDRJgwKzRJIg..."}

[9시 40분 6초] POST /api/register-options -> 200
  {"challenge":"oZZngmYZPFdhM_UqHKN6zbC_4RTPzt9Z37kVbSNHugU","rp":{"name":"WHITECLOVER Portfolio","id":"localhost"},"user":{"id":"olk-zt43S0NljpMvaMp1GkrXIBetNsy57ScoF2k39fI","name":"alice-demo","displayName":"alice-demo"},"pubKeyCredParams":[{"alg":-8,"type":"public-key"},{"alg":-7,"type":"public-key"},{"alg":-257,"type":"public-key"}],"timeout":60000,"attestation":"none","excludeCredentials":[{"id":"YxUTdq8hPdsrj_4fzygaVS7i61R3QOYZbEHYUcFIaiA","transports":["internal"],"type":"public-key"}],"authenticatorSelection":{"residentKey":"preferred","userVerification":"preferred","requireResidentKey":false},"extensions":{"credProps":true},"hints":[]}

[9시 40분 5초] GET /api/passkeys -> 200
  {"passkeys":[{"id":"YxUTdq8hPdsrj_4fzygaVS7i61R3QOYZbEHYUcFIaiA","name":"alice-노트북","createdAt":1788741605827,"publicKeyPreview":"pAEBAycgBiFYICX-LVqtpqIM..."}]}

[9시 40분 5초] GET /api/private -> 200
  {"username":"alice-demo","notes":[{"id":"note-1","text":"[더미] alice-demo의 준비 중인 프로젝트 메모 — \"딥페이크 탐지 v2 아이디어 정리 중\""},{"id":"note-2","text":"[더미] alice-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)"},{"id":"note-3","text":"[더미] alice-demo의 이번 달 회고 — \"패스키 과제로 WebAuthn 흐름을 직접 구현해봄\""}]}

[9시 40분 5초] GET /api/session -> 200
  {"loggedIn":true,"username":"alice-demo"}

[9시 40분 5초] POST /api/register-verify -> 200
  {"ok":true,"passkeyCount":1,"storedPublicKeyPreview":"pAEBAycgBiFYICX-LVqtpqIM..."}

[9시 40분 5초] POST /api/register-options -> 200
  {"challenge":"w0bD2pb7TSbYlfGQDMyCyBBbS5OfyhJQkzq2628FD9A","rp":{"name":"WHITECLOVER Portfolio","id":"localhost"},"user":{"id":"5VSl9WKBWjJIZTkc_z5vZgtJy6Z9zt4KK7ztRG_Ydgc","name":"alice-demo","displayName":"alice-demo"},"pubKeyCredParams":[{"alg":-8,"type":"public-key"},{"alg":-7,"type":"public-key"},{"alg":-257,"type":"public-key"}],"timeout":60000,"attestation":"none","excludeCredentials":[],"authenticatorSelection":{"residentKey":"preferred","userVerification":"preferred","requireResidentKey":false},"extensions":{"credProps":true},"hints":[]}

[9시 40분 4초] GET /api/session -> 200
  {"loggedIn":false}


```


## 카드3: 이미 성공 처리된 로그인 요청을 그대로 재전송 (challenge 재사용) 결과

```
{
  "status": 401,
  "body": {
    "error": "로그인용 질문이 없거나 이미 사용됨(또는 만료됨)."
  }
}
```


## 카드4: alice-노트북 패스키 삭제 후 상태

```
패스키 삭제됨 (남은 패스키 1개)
```


## 카드4: 삭제된 패스키(alice-노트북) id로 로그인 시도 결과 (거절되어야 함)

```
{
  "status": 401,
  "body": {
    "error": "이 계정에 등록된 패스키가 아닙니다."
  }
}
```


## 카드4: 남은 패스키(폰)로 재로그인 성공

```
alice-demo(으)로 로그인했습니다.
```


## 카드5: Bob 계정 등록/로그인 상태

```
패스키 등록 완료 (총 1개). 서버에 저장된 값(공개키): pAEBAycgBiFYIDY2ih4ju9wF...
```


## 카드5: Bob 비공개 메모 (Alice와 다름)

```
[더미] bob-demo의 준비 중인 프로젝트 메모 — "딥페이크 탐지 v2 아이디어 정리 중"
[더미] bob-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)
[더미] bob-demo의 이번 달 회고 — "패스키 과제로 WebAuthn 흐름을 직접 구현해봄"
```


## 카드5: Alice의 패스키 id로 bob-demo 계정 로그인 시도 (거절되어야 함)

```
{
  "status": 401,
  "body": {
    "error": "이 계정에 등록된 패스키가 아닙니다."
  }
}
```


## 카드5: Bob의 패스키 id로 alice-demo 계정 로그인 시도 (반대 방향, 거절되어야 함)

```
{
  "status": 401,
  "body": {
    "error": "이 계정에 등록된 패스키가 아닙니다."
  }
}
```


## 카드5: alice 세션으로 로그인한 채 쿼리·헤더에 bob-demo를 지정해도 내(alice) 자료만 오는지

```
{
  "mine": {
    "username": "alice-demo",
    "notes": [
      {
        "id": "note-1",
        "text": "[더미] alice-demo의 준비 중인 프로젝트 메모 — \"딥페이크 탐지 v2 아이디어 정리 중\""
      },
      {
        "id": "note-2",
        "text": "[더미] alice-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)"
      },
      {
        "id": "note-3",
        "text": "[더미] alice-demo의 이번 달 회고 — \"패스키 과제로 WebAuthn 흐름을 직접 구현해봄\""
      }
    ]
  },
  "spoofedByQuery": {
    "username": "alice-demo",
    "notes": [
      {
        "id": "note-1",
        "text": "[더미] alice-demo의 준비 중인 프로젝트 메모 — \"딥페이크 탐지 v2 아이디어 정리 중\""
      },
      {
        "id": "note-2",
        "text": "[더미] alice-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)"
      },
      {
        "id": "note-3",
        "text": "[더미] alice-demo의 이번 달 회고 — \"패스키 과제로 WebAuthn 흐름을 직접 구현해봄\""
      }
    ]
  },
  "spoofedByHeader": {
    "username": "alice-demo",
    "notes": [
      {
        "id": "note-1",
        "text": "[더미] alice-demo의 준비 중인 프로젝트 메모 — \"딥페이크 탐지 v2 아이디어 정리 중\""
      },
      {
        "id": "note-2",
        "text": "[더미] alice-demo의 지원 예정 기업 목록 — A사, B사, C사 (가상 이름)"
      },
      {
        "id": "note-3",
        "text": "[더미] alice-demo의 이번 달 회고 — \"패스키 과제로 WebAuthn 흐름을 직접 구현해봄\""
      }
    ]
  }
}
```
