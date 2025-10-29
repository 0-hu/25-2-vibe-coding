## 카드 뽑기 시뮬레이터 계획서 (Plan) - 확정 버전

### 1) 목표
- pokemon-cards-css 스타일의 홀로그래픽 카드 연출과 카드팩 "개봉" 체험을 결합
- UI 외곽/패널에 리퀴드글라스 효과(backdrop blur)로 고급 질감 부여 (최소화 적용)
- 10연 뽑기, 카드 뒤집기, 레어 연출 중심의 짧고 강한 데모 제작
- **오리지널 테마 카드**로 제작하되, 추후 이미지 교체 가능한 유연한 구조
- 최신 수집형 게임의 뽑기 확률/천장 시스템 적용

### 2) 사용자 흐름(UX 플로우)
1. 홈 진입 → 히어로 섹션에서 카드팩 선택
2. 카드팩 선택 → 개봉 스테이지로 이동
3. 포장 드래그(좌→우)로 “뜯기” 진행(진행도 인디케이터)
4. 개봉 완료 → 10장의 카드 뒷면이 그리드로 배치
5. 사용자가 한 장씩 클릭 → Y축 플립으로 앞면 공개(레어 연출 가변)
6. 전부 공개하면 결과 요약(레어리티, 중복, 신규) → 인벤토리 저장(localStorage)

### 3) 화면/컴포넌트 구조(초안)
- Header(리퀴드글라스 네비/상태 표시)
- PackGallery(팩 선택 슬라이더)
- PackOpenStage(포장 뜯기 인터랙션 + 진행도/가이드)
- TenRevealGrid(카드 10장 뒷면 정렬/등장)
- HoloCard(pokemon-cards-css 기반 카드 컴포넌트)
- ResultPanel(개봉 결과 요약, 리퀴드글라스)
- Inventory(보유 카드, 필터/정렬)
- Toast/Modal(알림/가이드, 리퀴드글라스)

### 4) 핵심 인터랙션/연출 설계
- 카드팩 뜯기
  - 포장 레이어의 clip-path 또는 mask를 드래그 진행도에 따라 애니메이트
  - 임계치 도달 시 찢어지는 이징 + 파티클/플래시 트리거
- 10장 뒷면 세팅
  - 페이드 인 + 살짝 퍼지는 stagger(순차 등장)
- 카드 앞/뒤 플립
  - transform: rotateY(180deg) + backface-visibility: hidden
  - 첫 공개 시 레어리티별 홀로 글레어 스윕(키프레임 background-position/mask-position)
- pokemon-cards-css 홀로 효과
  - perspective + 커서 기반 3D 틸트
  - conic-gradient/노이즈 텍스처 오버레이로 포일 스펙큘러 구현
- 리퀴드글라스(UI)
  - 헤더/패널/모달에 backdrop-filter: blur(...) + 반투명 유리광 하이라이트 스윕

### 5) 데이터 모델 (확정)
- **Rarity 가중치**: common(70%), rare(20%), epic(9%), mythic(1%)
- **Pack**: { id, name, theme, description, image, rarityWeights, pool }
- **CardDefinition**: { id, name, image, rarity, flavor } ※ 능력치 제외
- **OwnedCard**: { cardId, timestamp, serial, packId, count } ※ count로 중복 관리
- **PityCounter**: { packId, pullsSinceLastEpic, pullsSinceLastMythic, totalPulls }
- **저장소 키**:
  - `localStorage["inventory"]`: OwnedCard 배열
  - `localStorage["stats"]`: 전체 통계
  - `localStorage["pityCounters"]`: 천장 카운터 (필수)

### 6) 스테이트 머신
idle → selectingPack → tearing → revealingGrid → flipping → summary → inventory
- 가드: 드래그 진행도 ≥ 100% → 자동 전환; 10장 모두 flip 시 summary로 이동

### 7) 기술 스택 (확정)
- **기본**: HTML/CSS/JS(바닐라) + localStorage
- **애니메이션**: CSS 트랜지션/키프레임 + JS 스태거
- **라이브러리 허용**:
  - GSAP (드래그 인터랙션, 복잡한 타이밍)
  - Lottie (콘페티/파티클 연출)
  - Chart.js (통계 시각화, 선택)
  - Howler.js (사운드 관리, 권장)
- **사운드**: 기본 볼륨 50%, 레어리티별 차별화된 사운드 필수

### 8) 폴더 구조(제안)
- index.html
- styles/
  - base.css
  - holo-card.css (pokemon-cards-css 스타일)
  - liquid-glass.css
  - pack.css (개봉 스테이지)
  - grid.css (10장 배치)
- scripts/
  - main.js (상태/간단 라우팅)
  - packs.js (팩/확률 로직)
  - open-stage.js (드래그 뜯기)
  - reveal.js (10장 그리드/플립)
  - inventory.js (저장/정렬)
- data/
  - cards.json
  - packs.json
- assets/ (카드 일러스트/텍스처/사운드)

### 9) 상호작용 구현 가이드 (확정)

#### A) 드래그 뜯기
- Pointer Events로 시작/이동 추적 → 진행도 % 계산 → 포장 레이어 clip-path 업데이트
- 임계치 도달 시: 고정 해제 + 파티클/플래시, 팩 레이어 디졸브 아웃

#### B) 카드 플립 (2가지 모드)
1. **수동 클릭**: 각 카드 data-flipped=false → 클릭 시 true로 토글, 클래스 전환으로 회전
2. **"모두 공개" 버튼**: 모든 카드를 순차적으로 자동 플립 (stagger 0.15s)
- 첫 공개 순간 레어별 글레어 스윕(키프레임) + 사운드 재생

#### C) 3D 틸트/글레어
- 카드 중심 대비 마우스 오프셋 → rotateX/rotateY 적용, 글레어 레이어 위치 이동

#### D) 리퀴드글라스 (최소 적용)
- **적용 대상**: 헤더, 결과 패널만 (모달은 초안 후 결정)
- 반투명 패널 + backdrop-filter: blur(10px) + 내부 하이라이트 gradient sweep

#### E) 사운드 시스템
- **레어리티별 사운드**:
  - Common: 부드러운 플립 (whoosh-soft.mp3)
  - Rare: 차임벨 (chime.mp3)
  - Epic: 팡파레 (fanfare.mp3)
  - Mythic: 드라마틱 리빌 (reveal-epic.mp3)
- **기본 볼륨**: 50%
- **구현**: Howler.js 또는 Web Audio API

#### F) 천장 시스템 (Pity System)
- **표시 위치**: 화면 하단 고정 바
- **표시 내용**:
  - 현재까지 뽑은 총 횟수
  - Epic 천장까지 남은 횟수 (예: 30회마다 보장)
  - Mythic 천장까지 남은 횟수 (예: 90회마다 보장)
- **시각화**: 프로그레스 바 + 숫자

### 10) 마일스톤
- Day 1
  - 레이아웃/팩 선택/드래그 뜯기 MVP
  - 10장 그리드 + 플립 기본 동작
- Day 2
  - 홀로 효과/리퀴드글라스 폴리싱
  - 결과 요약/인벤토리 + README/GIF 캡쳐

### 11) 제출용 연출(README/GIF)
- GIF1: 팩 드래그 뜯기(1.5s)
- GIF2: 레어 카드 앞면 공개 순간(1.5s)
- GIF3: 인벤토리 정렬/필터(1.5s)

### 12) 프로젝트 구체화 - 확정 사항 ✅

| 항목 | 결정 사항 |
|------|-----------|
| **카드 테마** | 오리지널 테마 카드 (추후 이미지 교체 용이한 구조) |
| **기술 스택** | 바닐라 HTML/CSS/JS + GSAP/Chart.js/Howler.js 허용 |
| **카드 아트** | 플레이스홀더 이미지 사용 (unsplash/placeholder.com) |
| **사운드** | 사용, 기본 볼륨 50%, 레어리티별 다른 사운드 필수 |
| **천장 시스템** | 적용 (Epic 30회, Mythic 90회 보장), 화면 하단에 진행도 표시 |
| **공개 방식** | "모두 공개" 버튼 + 수동 1장씩 클릭 둘 다 구현 |
| **카드 정보** | 이름 + 레어리티 + 설명만 (능력치 제외) |
| **해상도 우선순위** | 데스크톱 우선 (1920x1080 기준, 반응형은 선택) |
| **중복 카드** | 카운트 스택 방식 (예: "카드명 x3") |
| **리퀴드글라스** | 최소화 (헤더, 결과 패널만. 초안 후 확장 검토) |

---

### 13) 구현 전 최종 확인 사항

#### 천장 시스템 상세
- Epic 보장: 30회 안에 Epic 이상 1장 보장
- Mythic 보장: 90회 안에 Mythic 1장 보장
- 보장 발동 시 해당 레어리티 확정 + 카운터 리셋

#### 카드 풀 규모
- 초안 카드 총 개수: 최소 40장 (Common 25, Rare 10, Epic 4, Mythic 1)
- 카드팩 종류: 1~2종 (확장 용이하게)

#### 오리지널 테마 방향 (확정)
- **다양한 장르 혼합**: Mystic Creatures, Cyber Elements, Fantasy Realms 등을 모두 포함
- **종족(Type) 시스템**: 각 카드는 종족으로 구분 (예: Dragon, Cyborg, Spirit, Elemental 등)
- 플레이스홀더 이미지: unsplash API 또는 직접 선정한 URL 사용

#### 카드팩 구성 (확정)
- **초기 카드팩**: 1종 ("Universal Pack" - 모든 종족 포함)
- 추후 확장: 종족별 전용 팩 추가 가능

#### 사운드 준비 (확정)
- **소스**: 무료 사운드 라이브러리 (Freesound.org, Zapsplat 등)
- 필요 사운드: 카드 플립(common), 차임벨(rare), 팡파레(epic), 드라마틱(mythic), 팩 개봉

#### 개발 우선순위 (확정)
- **1순위**: 코어 플로우 완성
  - 팩 선택 UI
  - 드래그 뜯기 인터랙션
  - 10장 카드 그리드 + 플립
  - 인벤토리 저장
- **2순위**: 비주얼 폴리싱
  - 홀로그래픽 효과
  - 리퀴드글라스 UI
  - 천장 시스템 표시


