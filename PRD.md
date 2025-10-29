# Product Requirements Document (PRD)
# Card Pack Simulator - "Mystic Gacha"

**버전**: 1.0
**작성일**: 2025-10-29
**프로젝트 코드명**: VibeCoding Card Simulator
**담당자**: Development Team

---

## 1. Executive Summary

### 1.1 Product Vision
pokemon-cards-css 스타일의 홀로그래픽 효과와 현대적인 리퀴드글라스 UI를 결합한 10연 카드팩 개봉 시뮬레이터. 사용자에게 시각적으로 만족스러운 가챠 경험과 컬렉션의 즐거움을 제공.

### 1.2 Product Goals
- 직관적이고 몰입감 있는 카드팩 개봉 경험 제공
- 홀로그래픽 효과로 프리미엄 카드 수집의 만족감 구현
- 공정한 확률과 천장 시스템으로 사용자 신뢰 확보
- 추후 카드/팩 확장이 용이한 아키텍처 구축

### 1.3 Success Metrics
- 카드팩 개봉 완료율 > 90%
- 인벤토리 저장 성공률 100%
- 평균 세션 시간 > 3분
- 천장 시스템 정확도 100%

---

## 2. Target Users

### 2.1 Primary Users
- 디지털 카드 게임 경험이 있는 사용자
- 수집형 컨텐츠를 즐기는 사용자
- 홀로그래픽/프리미엄 효과에 관심 있는 디자이너/개발자

### 2.2 User Personas
**Persona 1: "컬렉터 민수"**
- 25세, TCG/가챠 게임 경험자
- 레어 카드 수집과 확률 시스템에 관심
- 비주얼 퀄리티와 공정성 중요시

**Persona 2: "디자이너 수진"**
- 28세, UI/UX 디자이너
- 홀로그래픽 효과와 인터랙션 품질에 관심
- 포트폴리오 레퍼런스 수집 목적

---

## 3. Features & Requirements

### 3.1 Functional Requirements

#### FR-001: 카드팩 시스템
- **우선순위**: P0 (Critical)
- **설명**: 사용자가 카드팩을 선택하고 개봉할 수 있는 시스템
- **상세**:
  - 초기 1종 팩 제공 ("Universal Pack")
  - 팩당 10장의 카드 포함
  - 각 카드는 종족(Type) 속성 보유 (Dragon, Cyborg, Spirit, Elemental 등)
- **수용 기준**:
  - [ ] 팩 선택 UI가 표시됨
  - [ ] 팩 클릭 시 개봉 스테이지로 전환
  - [ ] 10장의 카드가 정확히 생성됨

#### FR-002: 확률 시스템
- **우선순위**: P0 (Critical)
- **설명**: 공정하고 투명한 카드 뽑기 확률 시스템
- **상세**:
  - Common: 70%
  - Rare: 20%
  - Epic: 9%
  - Mythic: 1%
- **수용 기준**:
  - [ ] 각 레어리티가 명시된 확률로 등장
  - [ ] 확률은 독립 시행 (각 카드별로 개별 계산)

#### FR-003: 천장(Pity) 시스템
- **우선순위**: P0 (Critical)
- **설명**: 일정 횟수 내 고레어 카드 보장
- **상세**:
  - Epic 천장: 30회 내 Epic 이상 1장 보장
  - Mythic 천장: 90회 내 Mythic 1장 보장
  - 보장 발동 시 카운터 리셋
- **수용 기준**:
  - [ ] Epic 30회 안에 Epic 이상 획득 보장
  - [ ] Mythic 90회 안에 Mythic 획득 보장
  - [ ] 획득 시 카운터 정확히 리셋
  - [ ] 화면 하단에 진행도 표시

#### FR-004: 드래그 뜯기 인터랙션
- **우선순위**: P0 (Critical)
- **설명**: 사용자가 팩을 드래그하여 개봉하는 인터랙션
- **상세**:
  - 좌→우 또는 원하는 방향으로 드래그
  - 진행도 0~100% 표시
  - 100% 도달 시 자동 개봉
  - 개봉 시 파티클/플래시 효과
- **수용 기준**:
  - [ ] 드래그 진행도가 시각적으로 표시됨
  - [ ] 100% 도달 시 개봉 애니메이션 실행
  - [ ] 개봉 후 카드 그리드로 전환

#### FR-005: 카드 공개 시스템
- **우선순위**: P0 (Critical)
- **설명**: 10장의 카드를 뒷면→앞면으로 공개
- **상세**:
  - 모드 1: 수동 클릭 (1장씩)
  - 모드 2: "모두 공개" 버튼 (순차 자동 플립, stagger 0.15s)
  - Y축 회전 애니메이션 (rotateY 180deg)
  - 레어리티별 공개 효과 차별화
- **수용 기준**:
  - [ ] 카드 클릭 시 플립 애니메이션 실행
  - [ ] "모두 공개" 버튼으로 순차 공개
  - [ ] 레어리티별 시각/청각 효과 차별화

#### FR-006: 인벤토리 시스템
- **우선순위**: P0 (Critical)
- **설명**: 획득한 카드를 저장하고 조회
- **상세**:
  - localStorage 기반 영구 저장
  - 중복 카드는 카운트로 누적 (예: "Dragon Card x3")
  - 필터링: 레어리티, 종족별
  - 정렬: 획득일, 레어리티, 이름
- **수용 기준**:
  - [ ] 개봉한 카드가 인벤토리에 저장
  - [ ] 중복 카드가 카운트로 누적
  - [ ] 필터/정렬 기능 동작
  - [ ] 페이지 새로고침 후에도 데이터 유지

#### FR-007: 홀로그래픽 효과
- **우선순위**: P1 (High)
- **설명**: pokemon-cards-css 스타일의 카드 효과
- **상세**:
  - 마우스 기반 3D 틸트 (perspective)
  - 커서 위치에 따른 rotateX/rotateY
  - Conic gradient + 노이즈 텍스처로 포일 효과
  - 레어리티별 글레어 스윕 애니메이션
- **수용 기준**:
  - [ ] 마우스 이동 시 카드 틸트 동작
  - [ ] 홀로그래픽 글레어 효과 표시
  - [ ] 레어 카드일수록 화려한 효과

#### FR-008: 사운드 시스템
- **우선순위**: P1 (High)
- **설명**: 레어리티별 차별화된 사운드
- **상세**:
  - Common: 부드러운 플립 사운드
  - Rare: 차임벨
  - Epic: 팡파레
  - Mythic: 드라마틱 리빌
  - 기본 볼륨: 50%
  - 사운드 ON/OFF 토글
- **수용 기준**:
  - [ ] 카드 공개 시 레어리티별 사운드 재생
  - [ ] 볼륨 조절 가능
  - [ ] 음소거 기능 동작

#### FR-009: 결과 요약 패널
- **우선순위**: P1 (High)
- **설명**: 개봉 결과 통계 표시
- **상세**:
  - 획득한 레어리티별 카드 수
  - 신규/중복 카드 구분
  - 리퀴드글라스 효과 적용
- **수용 기준**:
  - [ ] 10장 모두 공개 후 결과 패널 표시
  - [ ] 레어리티별 통계 정확
  - [ ] "인벤토리로" 버튼 동작

### 3.2 Non-Functional Requirements

#### NFR-001: 성능
- 카드 플립 애니메이션 60fps 유지
- localStorage 읽기/쓰기 < 100ms
- 페이지 로드 시간 < 2초

#### NFR-002: 호환성
- 모던 브라우저 지원 (Chrome 90+, Firefox 88+, Safari 14+)
- 데스크톱 우선 (1920x1080 기준)
- backdrop-filter 미지원 브라우저는 fallback 제공

#### NFR-003: 확장성
- 카드 데이터는 JSON으로 분리
- 새 카드/팩 추가 시 코드 수정 최소화
- 종족 시스템으로 향후 종족별 팩 확장 가능

#### NFR-004: 유지보수성
- 명확한 폴더 구조 (styles/, scripts/, data/, assets/)
- 주요 함수에 JSDoc 주석
- CSS 변수로 테마 관리

---

## 4. User Stories

### Epic 1: 카드팩 개봉
- **US-001**: 사용자로서, 나는 카드팩을 선택하여 개봉 경험을 시작하고 싶다.
- **US-002**: 사용자로서, 나는 드래그로 팩을 뜯으며 몰입감을 느끼고 싶다.
- **US-003**: 사용자로서, 나는 10장의 카드가 뒷면으로 배치된 것을 보고 기대감을 느끼고 싶다.

### Epic 2: 카드 수집
- **US-004**: 사용자로서, 나는 카드를 클릭하여 하나씩 공개하는 재미를 느끼고 싶다.
- **US-005**: 사용자로서, 나는 "모두 공개" 버튼으로 빠르게 결과를 확인하고 싶다.
- **US-006**: 사용자로서, 나는 레어 카드 공개 시 특별한 효과와 사운드로 희소성을 체감하고 싶다.

### Epic 3: 컬렉션 관리
- **US-007**: 사용자로서, 나는 획득한 카드를 인벤토리에서 확인하고 싶다.
- **US-008**: 사용자로서, 나는 레어리티/종족별로 필터링하여 원하는 카드를 찾고 싶다.
- **US-009**: 사용자로서, 나는 중복 카드의 개수를 한눈에 파악하고 싶다.

### Epic 4: 공정성 확인
- **US-010**: 사용자로서, 나는 천장 시스템으로 몇 번 안에 고레어를 얻을지 알고 싶다.
- **US-011**: 사용자로서, 나는 뽑기 확률이 공정하다는 것을 신뢰하고 싶다.

---

## 5. Technical Requirements

### 5.1 Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Animation**: GSAP 3.x
- **Sound**: Howler.js 2.x
- **Storage**: localStorage API
- **Asset Sources**:
  - 카드 이미지: Unsplash API / placeholder.com
  - 사운드: Freesound.org, Zapsplat (CC0/Attribution)

### 5.2 Data Models

#### CardDefinition
```json
{
  "id": "card_001",
  "name": "Ancient Dragon",
  "rarity": "mythic",
  "type": "Dragon",
  "flavor": "The last guardian of the forgotten realm.",
  "image": "https://example.com/card_001.jpg"
}
```

#### Pack
```json
{
  "id": "pack_universal",
  "name": "Universal Pack",
  "description": "Contains cards from all realms",
  "image": "https://example.com/pack.jpg",
  "rarityWeights": {
    "common": 70,
    "rare": 20,
    "epic": 9,
    "mythic": 1
  },
  "pool": ["card_001", "card_002", "..."]
}
```

#### OwnedCard (localStorage)
```json
{
  "cardId": "card_001",
  "timestamp": 1698765432000,
  "serial": "001234",
  "packId": "pack_universal",
  "count": 3
}
```

#### PityCounter (localStorage)
```json
{
  "packId": "pack_universal",
  "pullsSinceLastEpic": 15,
  "pullsSinceLastMythic": 67,
  "totalPulls": 120
}
```

### 5.3 File Structure
```
/
├── index.html
├── styles/
│   ├── base.css              # Reset, variables, layout
│   ├── holo-card.css         # Holographic effects
│   ├── liquid-glass.css      # Backdrop blur UI
│   ├── pack.css              # Pack opening stage
│   └── grid.css              # 10-card reveal grid
├── scripts/
│   ├── main.js               # State machine, initialization
│   ├── packs.js              # Pack/probability logic
│   ├── open-stage.js         # Drag-to-tear interaction
│   ├── reveal.js             # Card grid and flip
│   └── inventory.js          # Storage management
├── data/
│   ├── cards.json            # 40+ card definitions
│   └── packs.json            # Pack configurations
└── assets/
    ├── images/               # Card artwork
    ├── sounds/               # Audio files
    └── textures/             # Noise textures for holo effect
```

### 5.4 State Machine
```
States: idle → selectingPack → tearing → revealingGrid → flipping → summary → inventory

Transitions:
- selectingPack → tearing: 팩 클릭
- tearing → revealingGrid: 드래그 진행도 100%
- revealingGrid → flipping: 카드 그리드 표시 완료
- flipping → summary: 10장 모두 공개 완료
- summary → inventory: "인벤토리로" 버튼 클릭
- inventory → selectingPack: "새 팩 열기" 버튼
```

---

## 6. Design Requirements

### 6.1 Visual Design
- **컬러 스킴**:
  - Common: #9CA3AF (회색)
  - Rare: #3B82F6 (파란색)
  - Epic: #A855F7 (보라색)
  - Mythic: #F59E0B (금색)
- **리퀴드글라스**: `backdrop-filter: blur(10px)`, 반투명 배경 (rgba(255,255,255,0.1))
- **폰트**: 시스템 폰트 스택 또는 Google Fonts (Poppins, Inter)

### 6.2 Animation Guidelines
- **카드 플립**: 0.6s ease-in-out
- **홀로 틸트**: 마우스 이동 시 0.1s 지연
- **글레어 스윕**: 1.2s cubic-bezier
- **팩 개봉**: 0.8s 찢어지는 효과 + 파티클

### 6.3 Sound Design
- **볼륨 범위**: 0~100%, 기본 50%
- **포맷**: MP3 또는 OGG
- **파일 크기**: 각 사운드 < 200KB

---

## 7. Constraints & Assumptions

### 7.1 Constraints
- 빌드 프로세스 없이 정적 파일로 실행 가능해야 함
- localStorage 용량 제한 (5MB 이내 관리)
- 외부 API 의존성 최소화 (이미지는 URL만 저장)

### 7.2 Assumptions
- 사용자는 최신 브라우저를 사용
- 사용자는 사운드 재생 권한을 허용
- localStorage가 활성화되어 있음

---

## 8. Risk & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| localStorage 용량 초과 | High | Low | 오래된 데이터 자동 정리, 압축 |
| 브라우저 호환성 이슈 | Medium | Medium | Polyfill, fallback UI |
| 사운드 자동재생 차단 | Low | High | 사용자 클릭 후 재생, 안내 |
| 성능 저하 (많은 카드) | Medium | Low | 가상화, 페이지네이션 |

---

## 9. Future Enhancements (Out of Scope for v1.0)

- 종족별 전용 팩 (Dragon Pack, Cyber Pack 등)
- 카드 교환 시스템
- 소셜 공유 기능
- 다국어 지원
- 모바일 최적화
- 애니메이션 설정 (저사양 모드)
- 카드 합성 시스템
- 업적/뱃지 시스템

---

## 10. Acceptance Criteria (Definition of Done)

### v1.0 Release Criteria
- [ ] 모든 P0 기능 구현 완료
- [ ] 천장 시스템 정확도 100% 검증
- [ ] 크로스 브라우저 테스트 통과 (Chrome, Firefox, Safari)
- [ ] localStorage 데이터 영속성 검증
- [ ] README.md 작성 (실행 방법, 기능 설명, 스크린샷)
- [ ] 3개 GIF 데모 제작 (팩 개봉, 카드 공개, 인벤토리)
- [ ] 코드 주석 및 정리 완료

---

## 11. Appendix

### 11.1 References
- pokemon-cards-css: https://github.com/simeydotme/pokemon-cards-css
- 천장 시스템 참고: Genshin Impact, Honkai Star Rail

### 11.2 Glossary
- **가챠 (Gacha)**: 무작위 아이템 획득 시스템
- **천장 (Pity)**: 일정 횟수 내 고레어 보장 시스템
- **홀로그래픽 (Holographic)**: 무지개빛 광택 효과
- **리퀴드글라스 (Liquid Glass)**: 유리처럼 투명한 블러 UI

---

**문서 버전 이력**
- v1.0 (2025-10-29): 초안 작성
