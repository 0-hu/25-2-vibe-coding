## 동물 월드컵 웹앱 PRD

### 1) 개요
- **프로젝트명**: 동물 월드컵 (Animal World Cup)
- **한 줄 설명**: 사용자가 4개의 동물 카테고리 중 하나를 선택하면, 해당 주제의 이미지 16장을 불러와 1:1 토너먼트(월드컵)로 최종 1위를 가린다.
- **실행 환경**: 로컬 정적 웹(HTML/CSS/JS, 브라우저에서 바로 실행)
- **데이터 소스**: 무료 동물 이미지 API (Dog CEO API, The Cat API, RandomFox API)

### 2) 목표
- 사용자가 가볍게 참여할 수 있는 동물 선호도 테스트 제공
- 월드컵 메커니즘으로 반복 참여 유도 및 즐거움 제공
- 결과/선호 데이터의 로컬 저장을 통해 재방문 경험 개선
- 레트로 픽셀 아트 감성의 UI로 차별화된 경험 제공

### 3) 범위(Scope)
- 카테고리 선택 화면(4개 중 택1)
- 선택된 카테고리에 대한 이미지 16장 수집 및 준비(API 실시간 로딩)
- 1:1 매치업으로 16→8→4→2→1 진행
- 진행도/라운드 표시, 라운드별 타이머, 결과 화면(우승 이미지 및 전체 순위)
- 로컬 저장(localStorage): 마지막 카테고리, 플레이 이력, 설정

### 4) 비범위(Out of Scope)
- 서버/백엔드 구축(초기 버전은 프론트 단독)
- 소셜 로그인/실시간 공유 기능
- 고급 추천/개인화 알고리즘

### 5) 타깃 사용자 및 가치
- **타깃**: 동물을 좋아하는 사용자, 가벼운 게임/테스트를 즐기는 일반 사용자
- **가치**: 선호 탐색의 재미, 귀여운 동물 이미지를 감상하는 즐거움, 레트로 감성의 UI

### 6) 주요 사용자 플로우
1. 홈: 카테고리 선택 (강아지/고양이/여우/믹스) → [시작하기]
2. 로딩: 이미지 16장 수집·프리로드 → 준비 완료
3. 경기: 두 이미지 중 선호를 클릭 또는 키보드(←/→) → 다음 매치로 진행
4. 결과: 최종 1위 이미지 표시 + 전체 순위 그리드

### 7) 카테고리
- **제공 카테고리**
  - 🐶 강아지 (Dogs) → Dog CEO API
  - 🐱 고양이 (Cats) → The Cat API
  - 🦊 여우 (Foxes) → RandomFox API
  - 🎲 믹스 (Mix) → 위 3개 카테고리를 섞음 (강아지 5장, 고양이 6장, 여우 5장)

### 8) 이미지 소스 전략
- **API 선택 이유**: 무료, API Key 불필요, 안정적인 서비스
- **Dog CEO API**: `https://dog.ceo/api/breeds/image/random`
- **The Cat API**: `https://api.thecatapi.com/v1/images/search`
- **RandomFox API**: `https://randomfox.ca/floof/`
- **이미지 캐싱**: 카테고리 카드용 이미지는 한 번 로드 후 캐시에 저장
- **크레딧 표기**: 게임 카드 하단에 소형 텍스트로 API 크레딧 표시

### 9) 토너먼트 규칙
- **구성**: 16장 → 8강 → 4강 → 준결승 → 결승 → 우승
- **매치업 생성**: 16장을 Fisher-Yates 알고리즘으로 무작위 셔플 후 순차 페어링
- **선택 인터랙션**: 좌/우 이미지 중 하나를 클릭 또는 키보드(←/→)
- **시간 제한**: 라운드별 10초, 상단 프로그레스 바로 시각화, 시간 초과 시 무작위 자동 선택
- **중단/복귀**: 진행 상태를 localStorage에 저장해 브라우저 리프레시 후 복귀 가능
- **재시작**: 동일 카테고리로 재시작 또는 다른 카테고리 선택 가능

### 10) 화면/UX 설계
- **화면 구성**
  - 홈: 4개 카테고리 그리드 (1줄 배치), 플레이 횟수 배지, [시작하기] 버튼
  - 로딩: 진행 퍼센트, 회전하는 스피너, 실패 시 재시도
  - 경기: 좌우 이미지 카드, 중앙 VS 텍스트, 상단 타이머 바, 라운드 정보
  - 결과: 우승 이미지 (큰 카드), 전체 순위 그리드, "다시 하기"/"다른 카테고리" CTA
- **디자인 가이드**
  - 카드 비율: 3:4 (세로형)
  - UI 스타일: **레트로 픽셀 아트 감성**
    - Press Start 2P 비트맵 폰트 사용
    - 굵은 픽셀 테두리 (3px solid)
    - 픽셀 그림자 효과 (4px 4px 0px)
    - 컬러: 핑크, 시안, 노란색 악센트
  - 반응형: 모바일 1열 스택, 데스크탑 2열 비교
  - 텍스트 크기: 전체적으로 1.3배 확대하여 가독성 향상
- **카테고리 카드 UI**
  - 상단: 이미지 영역 (4:3 비율, object-fit: cover)
  - 하단: 텍스트 영역 (카테고리명, 설명)
  - 믹스 카테고리: 이미지 대신 큰 '?' 텍스트 표시 (120px, 노란색)
  - 선택 시: 핑크 배경, 노란색 그림자, 살짝 위로 이동

### 11) 데이터/저장 설계
- **localStorage 키**
  - `uc:settings` — 최근 카테고리, 타이머 설정
  - `uc:lastSession` — 현재 진행 중 토너먼트 상태
  - `uc:history` — 플레이 기록 배열
- **데이터 모델**
  - ImageItem: `{ id, urlSmall, urlFull, credit }`
  - SessionState: `{ category, round, pairs[], survivors[], cursor, startedAt }`
  - Settings: `{ lastCategory, timeLimitSec: 10 }`

### 12) 성능/안정성
- 16장 프리로드 시 네트워크 부하 고려 → 순차 로딩 with progress
- 로딩 실패 시 재시도 로직 (최대 5회)
- API 요청 간 딜레이 추가 (100ms) - 레이트 리밋 방지

### 13) 에러/예외 처리
- 네트워크 실패: 재시도 버튼 제공, 에러 메시지 표시
- 이미지 로딩 실패: 해당 이미지 스킵하고 다음 시도
- API 타임아웃: 10초 타임아웃 설정

### 14) 라이선스/크레딧
- **Dog CEO API**: MIT License, 무료 사용
- **The Cat API**: 무료 티어 사용
- **RandomFox API**: 무료 사용
- **Press Start 2P 폰트**: Google Fonts, SIL Open Font License
- **Footer**: Copyright © 2025 by KwonYoungHu @Kookmin University

### 15) 측정(로컬 기준)
- 세션 완료율(시작 대비 완료)
- 카테고리별 참여수
- 플레이 횟수 (localStorage에 저장)

### 16) 기술 스택
- **Frontend**: Vanilla JavaScript (ES6+)
- **CSS**: CSS Variables, Flexbox, Grid
- **Font**: Press Start 2P (Google Fonts)
- **Storage**: localStorage
- **Build**: 없음 (정적 HTML 직접 실행)

### 17) 개선 가능 항목 (향후)
- 더 많은 동물 카테고리 추가 (토끼, 새, 판다 등)
- 결과 공유 기능 (이미지 다운로드, SNS 공유)
- 다크 모드 / 라이트 모드 전환
- 효과음 및 배경음악
- 32강 또는 64강 옵션 추가

### 18) 부록: API 엔드포인트
- **Dog CEO API**
  - 랜덤 이미지: `GET https://dog.ceo/api/breeds/image/random`
  - 응답: `{ "message": "https://...", "status": "success" }`
- **The Cat API**
  - 랜덤 이미지: `GET https://api.thecatapi.com/v1/images/search`
  - 응답: `[{ "url": "https://..." }]`
- **RandomFox API**
  - 랜덤 이미지: `GET https://randomfox.ca/floof/`
  - 응답: `{ "image": "https://...", "link": "https://..." }`

### 19) 파일 구조
```
/VibeCoding
├── index.html              # 메인 HTML
├── README.md               # 프로젝트 설명
├── /scripts
│   ├── main.js            # 메인 로직 (통합)
│   └── logger.js          # 디버그 로거
├── /styles
│   ├── variables.css      # CSS 변수
│   ├── main.css           # 전역 스타일
│   ├── pixel.css          # 픽셀 UI 컴포넌트
│   └── screens.css        # 화면별 스타일
└── /docs
    ├── PRD.md             # 이 문서
    ├── revision.md        # 변경 이력
    ├── plan.md            # 개발 계획
    └── source.md          # 이미지 소스 참고
```
