# Development Roadmap & Task Breakdown
# VibeCoding Card Simulator

**버전**: 1.0
**작성일**: 2025-10-29
**개발 우선순위**: 코어 플로우 → 비주얼 폴리싱

---

## 📋 Development Phases Overview

### Phase 0: 프로젝트 초기 설정 (30분)
프로젝트 구조, 기본 파일, 개발 환경 준비

### Phase 1: 데이터 레이어 (1시간)
카드 데이터, 팩 데이터, 확률 시스템 구현

### Phase 2: 기본 UI 레이아웃 (1.5시간)
HTML 구조, CSS 베이스, 상태 머신 골격

### Phase 3: 팩 선택 & 개봉 스테이지 (2시간)
팩 선택 UI, 드래그 뜯기 인터랙션

### Phase 4: 카드 공개 시스템 (2.5시간)
10장 그리드, 플립 애니메이션, 수동/자동 공개

### Phase 5: 인벤토리 시스템 (2시간)
localStorage 저장, 중복 관리, 필터/정렬

### Phase 6: 천장 시스템 (1.5시간)
Pity 카운터, UI 표시, 보장 로직

### Phase 7: 홀로그래픽 효과 (2시간)
3D 틸트, 글레어 효과, 레어리티별 연출

### Phase 8: 사운드 시스템 (1.5시간)
사운드 에셋 준비, 재생 로직, 볼륨 컨트롤

### Phase 9: 리퀴드글라스 UI (1시간)
헤더, 결과 패널 스타일링

### Phase 10: 테스트 & 폴리싱 (2시간)
버그 수정, 성능 최적화, 크로스 브라우저 테스트

**총 예상 시간**: ~17시간

---

## 🔧 Phase 0: 프로젝트 초기 설정

### Task 0.1: 폴더 구조 생성
**소요 시간**: 5분
**의존성**: 없음

#### 작업 내용
```bash
mkdir -p styles scripts data assets/images assets/sounds assets/textures
touch index.html
touch styles/{base,holo-card,liquid-glass,pack,grid}.css
touch scripts/{main,packs,open-stage,reveal,inventory}.js
touch data/{cards,packs}.json
```

#### 체크리스트
- [ ] 모든 폴더 생성 확인
- [ ] 모든 파일 생성 확인
- [ ] 파일 권한 확인

---

### Task 0.2: index.html 기본 구조 작성
**소요 시간**: 15분
**의존성**: Task 0.1

#### 작업 내용
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mystic Gacha - Card Pack Simulator</title>
  <!-- CSS -->
  <link rel="stylesheet" href="styles/base.css">
  <link rel="stylesheet" href="styles/liquid-glass.css">
  <link rel="stylesheet" href="styles/pack.css">
  <link rel="stylesheet" href="styles/grid.css">
  <link rel="stylesheet" href="styles/holo-card.css">
</head>
<body>
  <!-- Header -->
  <header class="liquid-glass-header">
    <h1>Mystic Gacha</h1>
    <div class="controls">
      <button id="volumeToggle">🔊</button>
      <button id="inventoryBtn">📦 Inventory</button>
    </div>
  </header>

  <!-- Main Container -->
  <main id="app">
    <!-- 상태별 화면이 여기 렌더링됨 -->
  </main>

  <!-- Pity Counter (Fixed Bottom) -->
  <div id="pityCounter" class="pity-bar">
    <div class="pity-item">
      <span>Total: <strong id="totalPulls">0</strong></span>
    </div>
    <div class="pity-item">
      <span>Epic in: <strong id="epicCounter">30</strong></span>
      <div class="progress-bar"><div id="epicProgress"></div></div>
    </div>
    <div class="pity-item">
      <span>Mythic in: <strong id="mythicCounter">90</strong></span>
      <div class="progress-bar"><div id="mythicProgress"></div></div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
  <script type="module" src="scripts/main.js"></script>
</body>
</html>
```

#### 체크리스트
- [ ] HTML5 doctype 선언
- [ ] 메타 태그 설정
- [ ] CSS 파일 링크 순서 확인
- [ ] CDN 스크립트 로드 확인 (GSAP, Howler.js)
- [ ] 주요 컨테이너 요소 존재 확인

---

### Task 0.3: base.css 초기 설정
**소요 시간**: 10분
**의존성**: Task 0.1

#### 작업 내용
- CSS Reset (또는 Normalize.css)
- CSS 변수 정의 (색상, 폰트, 간격)
- 기본 레이아웃 설정

```css
/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* CSS Variables */
:root {
  /* Colors - Rarity */
  --color-common: #9CA3AF;
  --color-rare: #3B82F6;
  --color-epic: #A855F7;
  --color-mythic: #F59E0B;

  /* Colors - UI */
  --bg-dark: #0F172A;
  --bg-secondary: #1E293B;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;

  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 16px;

  /* Effects */
  --blur-amount: 10px;
  --transition-speed: 0.3s;
}

/* Base Styles */
html, body {
  height: 100%;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  background: var(--bg-dark);
  color: var(--text-primary);
  overflow-x: hidden;
}

#app {
  min-height: calc(100vh - 120px);
  padding: var(--spacing-lg);
}
```

#### 체크리스트
- [ ] CSS 변수 정의 완료
- [ ] Reset 스타일 적용
- [ ] 기본 폰트 및 배경색 확인

---

## 📊 Phase 1: 데이터 레이어

### Task 1.1: cards.json 데이터 생성
**소요 시간**: 30분
**의존성**: Task 0.1

#### 작업 내용
최소 40장의 카드 데이터 작성 (Common 25, Rare 10, Epic 4, Mythic 1)

```json
[
  {
    "id": "card_001",
    "name": "Ancient Dragon",
    "rarity": "mythic",
    "type": "Dragon",
    "flavor": "The last guardian of the forgotten realm.",
    "image": "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=400"
  },
  {
    "id": "card_002",
    "name": "Cyber Sentinel",
    "rarity": "epic",
    "type": "Cyborg",
    "flavor": "Programmed to protect, destined to evolve.",
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400"
  }
  // ... 38장 더 추가
]
```

#### 종족 분배 (예시)
- Dragon: 8장
- Cyborg: 8장
- Spirit: 8장
- Elemental: 8장
- Beast: 8장

#### 체크리스트
- [ ] 총 40장 이상의 카드 생성
- [ ] 레어리티 분배 확인 (Common 25, Rare 10, Epic 4, Mythic 1)
- [ ] 모든 카드에 id, name, rarity, type, flavor, image 필드 존재
- [ ] Unsplash URL 유효성 확인
- [ ] JSON 문법 에러 없음

---

### Task 1.2: packs.json 데이터 생성
**소요 시간**: 10분
**의존성**: Task 1.1

#### 작업 내용
```json
[
  {
    "id": "pack_universal",
    "name": "Universal Pack",
    "description": "Contains mystical cards from all realms",
    "image": "https://images.unsplash.com/photo-1618588507085-c79565432917?w=400",
    "rarityWeights": {
      "common": 70,
      "rare": 20,
      "epic": 9,
      "mythic": 1
    },
    "pool": [
      "card_001", "card_002", "card_003"
      // ... 모든 카드 ID
    ]
  }
]
```

#### 체크리스트
- [ ] pool 배열에 모든 카드 ID 포함
- [ ] rarityWeights 합계 = 100
- [ ] JSON 문법 에러 없음

---

### Task 1.3: packs.js - 확률 시스템 구현
**소요 시간**: 20분
**의존성**: Task 1.1, 1.2

#### 작업 내용
```javascript
// scripts/packs.js

let cardsData = [];
let packsData = [];

// 데이터 로드
export async function loadData() {
  const [cardsRes, packsRes] = await Promise.all([
    fetch('data/cards.json'),
    fetch('data/packs.json')
  ]);
  cardsData = await cardsRes.json();
  packsData = await packsRes.json();
}

// 가중치 기반 랜덤 선택
function weightedRandom(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  for (const [rarity, weight] of Object.entries(weights)) {
    if (random < weight) return rarity;
    random -= weight;
  }
}

// 레어리티 풀에서 카드 선택
function getCardByRarity(rarity, pool) {
  const rarityCards = pool.filter(card => card.rarity === rarity);
  return rarityCards[Math.floor(Math.random() * rarityCards.length)];
}

// 10장 뽑기 (천장 적용)
export function draw10Cards(packId, pityCounter) {
  const pack = packsData.find(p => p.id === packId);
  const pool = cardsData.filter(c => pack.pool.includes(c.id));
  const results = [];

  for (let i = 0; i < 10; i++) {
    let rarity = weightedRandom(pack.rarityWeights);

    // Epic 천장 체크 (30회)
    if (pityCounter.pullsSinceLastEpic >= 29) {
      rarity = Math.random() < 0.5 ? 'epic' : 'mythic';
    }

    // Mythic 천장 체크 (90회)
    if (pityCounter.pullsSinceLastMythic >= 89) {
      rarity = 'mythic';
    }

    const card = getCardByRarity(rarity, pool);
    results.push(card);

    // 카운터 업데이트
    pityCounter.totalPulls++;
    pityCounter.pullsSinceLastEpic++;
    pityCounter.pullsSinceLastMythic++;

    if (rarity === 'epic' || rarity === 'mythic') {
      pityCounter.pullsSinceLastEpic = 0;
    }
    if (rarity === 'mythic') {
      pityCounter.pullsSinceLastMythic = 0;
    }
  }

  return results;
}

export { cardsData, packsData };
```

#### 체크리스트
- [ ] loadData() 함수 동작 확인
- [ ] weightedRandom() 확률 분포 테스트
- [ ] draw10Cards() 정확히 10장 반환
- [ ] 천장 시스템 로직 검증 (30회, 90회)

---

## 🎨 Phase 2: 기본 UI 레이아웃

### Task 2.1: 상태 머신 구현 (main.js)
**소요 시간**: 30분
**의존성**: Task 0.2

#### 작업 내용
```javascript
// scripts/main.js
import { loadData, draw10Cards } from './packs.js';
import { renderPackSelection } from './open-stage.js';
import { renderRevealGrid } from './reveal.js';
import { loadInventory, saveToInventory } from './inventory.js';

// 상태
let currentState = 'idle';
let currentPack = null;
let drawnCards = [];
let pityCounter = {
  pullsSinceLastEpic: 0,
  pullsSinceLastMythic: 0,
  totalPulls: 0
};

// 상태 전환
export function setState(newState, data = {}) {
  console.log(`State: ${currentState} → ${newState}`);
  currentState = newState;

  switch (newState) {
    case 'selectingPack':
      renderPackSelection();
      break;
    case 'tearing':
      renderTearingStage(data.pack);
      break;
    case 'revealingGrid':
      drawnCards = draw10Cards(data.pack.id, pityCounter);
      renderRevealGrid(drawnCards);
      break;
    case 'summary':
      renderSummary(drawnCards);
      break;
    case 'inventory':
      renderInventory();
      break;
  }

  updatePityUI();
}

// Pity UI 업데이트
function updatePityUI() {
  document.getElementById('totalPulls').textContent = pityCounter.totalPulls;
  document.getElementById('epicCounter').textContent = 30 - pityCounter.pullsSinceLastEpic;
  document.getElementById('mythicCounter').textContent = 90 - pityCounter.pullsSinceLastMythic;

  const epicProgress = (pityCounter.pullsSinceLastEpic / 30) * 100;
  const mythicProgress = (pityCounter.pullsSinceLastMythic / 90) * 100;
  document.getElementById('epicProgress').style.width = epicProgress + '%';
  document.getElementById('mythicProgress').style.width = mythicProgress + '%';
}

// 초기화
async function init() {
  await loadData();

  // localStorage에서 pity 로드
  const savedPity = localStorage.getItem('pityCounter');
  if (savedPity) {
    pityCounter = JSON.parse(savedPity);
  }

  setState('selectingPack');
}

// Pity 저장
window.addEventListener('beforeunload', () => {
  localStorage.setItem('pityCounter', JSON.stringify(pityCounter));
});

init();
```

#### 체크리스트
- [ ] setState() 상태 전환 동작
- [ ] pityCounter localStorage 저장/로드 확인
- [ ] updatePityUI() 화면 업데이트 확인

---

### Task 2.2: liquid-glass.css 구현
**소요 시간**: 20분
**의존성**: Task 0.3

#### 작업 내용
```css
/* styles/liquid-glass.css */

.liquid-glass-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  backdrop-filter: blur(var(--blur-amount));
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-lg);
  z-index: 1000;
}

.liquid-glass-panel {
  backdrop-filter: blur(var(--blur-amount));
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
}

/* 하이라이트 스윕 효과 */
.liquid-glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: sweep 3s infinite;
}

@keyframes sweep {
  0%, 100% { left: -100%; }
  50% { left: 100%; }
}
```

#### 체크리스트
- [ ] backdrop-filter 동작 확인 (최신 브라우저)
- [ ] 하이라이트 스윕 애니메이션 확인
- [ ] 투명도/블러 적절한지 시각 확인

---

### Task 2.3: pity-bar 스타일링
**소요 시간**: 20분
**의존성**: Task 2.2

#### 작업 내용
```css
/* styles/base.css에 추가 */

.pity-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  backdrop-filter: blur(var(--blur-amount));
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 var(--spacing-lg);
  z-index: 999;
}

.pity-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.progress-bar {
  width: 120px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar > div {
  height: 100%;
  background: linear-gradient(90deg, var(--color-rare), var(--color-epic));
  transition: width 0.3s ease;
}
```

#### 체크리스트
- [ ] 하단 고정 확인
- [ ] 프로그레스 바 애니메이션 확인
- [ ] 반응형 레이아웃 확인

---

## 📦 Phase 3: 팩 선택 & 개봉 스테이지

### Task 3.1: 팩 선택 UI 렌더링
**소요 시간**: 30분
**의존성**: Task 2.1, Phase 1

#### 작업 내용
```javascript
// scripts/open-stage.js

import { packsData } from './packs.js';
import { setState } from './main.js';

export function renderPackSelection() {
  const app = document.getElementById('app');

  const html = `
    <div class="pack-selection">
      <h2>Choose Your Pack</h2>
      <div class="pack-grid">
        ${packsData.map(pack => `
          <div class="pack-card" data-pack-id="${pack.id}">
            <img src="${pack.image}" alt="${pack.name}">
            <h3>${pack.name}</h3>
            <p>${pack.description}</p>
            <button class="select-btn">Open Pack</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  app.innerHTML = html;

  // 이벤트 리스너
  document.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const packId = e.target.closest('.pack-card').dataset.packId;
      const pack = packsData.find(p => p.id === packId);
      setState('tearing', { pack });
    });
  });
}
```

#### CSS (pack.css)
```css
.pack-selection {
  text-align: center;
  padding: var(--spacing-xl);
}

.pack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.pack-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: var(--spacing-md);
  transition: transform 0.3s;
  cursor: pointer;
}

.pack-card:hover {
  transform: translateY(-5px);
}

.pack-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.select-btn {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-rare);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.select-btn:hover {
  background: var(--color-epic);
}
```

#### 체크리스트
- [ ] 팩 카드 렌더링 확인
- [ ] 클릭 시 tearing 상태로 전환
- [ ] 호버 애니메이션 동작

---

### Task 3.2: 드래그 뜯기 인터랙션
**소요 시간**: 1시간 30분
**의존성**: Task 3.1

#### 작업 내용
```javascript
// scripts/open-stage.js에 추가

export function renderTearingStage(pack) {
  const app = document.getElementById('app');

  const html = `
    <div class="tearing-stage">
      <div class="pack-wrapper">
        <div class="pack-overlay" id="packOverlay">
          <img src="${pack.image}" alt="${pack.name}">
          <div class="tear-progress">
            <span id="progressText">Drag to open →</span>
            <div class="progress-bar">
              <div id="tearProgress" class="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  app.innerHTML = html;

  initDragToTear(pack);
}

function initDragToTear(pack) {
  const overlay = document.getElementById('packOverlay');
  const progressFill = document.getElementById('tearProgress');
  const progressText = document.getElementById('progressText');

  let isDragging = false;
  let startX = 0;
  let currentProgress = 0;

  overlay.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    overlay.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    currentProgress = Math.min(Math.max(deltaX / window.innerWidth, 0), 1);

    // UI 업데이트
    progressFill.style.width = (currentProgress * 100) + '%';
    progressText.textContent = Math.floor(currentProgress * 100) + '%';

    // Clip-path 애니메이션
    overlay.style.clipPath = `inset(0 ${(1 - currentProgress) * 100}% 0 0)`;

    // 임계치 도달
    if (currentProgress >= 1) {
      completeTearing(pack);
    }
  });

  window.addEventListener('pointerup', () => {
    if (isDragging && currentProgress < 1) {
      // 되돌리기 애니메이션
      gsap.to(overlay, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.3,
        onComplete: () => {
          currentProgress = 0;
          progressFill.style.width = '0%';
          progressText.textContent = 'Drag to open →';
        }
      });
    }
    isDragging = false;
    overlay.style.cursor = 'grab';
  });
}

function completeTearing(pack) {
  const overlay = document.getElementById('packOverlay');

  // 파티클 효과 (간단한 버전)
  overlay.classList.add('explode');

  // GSAP 애니메이션
  gsap.to(overlay, {
    opacity: 0,
    scale: 1.2,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => {
      setState('revealingGrid', { pack });
    }
  });
}
```

#### CSS
```css
.tearing-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.pack-wrapper {
  position: relative;
  width: 400px;
  height: 600px;
}

.pack-overlay {
  width: 100%;
  height: 100%;
  cursor: grab;
  user-select: none;
  position: relative;
  clip-path: inset(0 0 0 0);
  transition: clip-path 0.1s;
}

.pack-overlay img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.tear-progress {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  text-align: center;
}

.pack-overlay.explode {
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
```

#### 체크리스트
- [ ] 드래그 진행도 0~100% 표시
- [ ] clip-path 애니메이션 동작
- [ ] 100% 도달 시 자동 전환
- [ ] 중간에 놓으면 되돌아감
- [ ] GSAP 애니메이션 확인

---

## 🃏 Phase 4: 카드 공개 시스템

### Task 4.1: 10장 카드 그리드 렌더링
**소요 시간**: 40분
**의존성**: Phase 3

#### 작업 내용
```javascript
// scripts/reveal.js

import { setState } from './main.js';

export function renderRevealGrid(cards) {
  const app = document.getElementById('app');

  const html = `
    <div class="reveal-stage">
      <h2>Click to Reveal</h2>
      <button id="revealAllBtn" class="reveal-all-btn">Reveal All</button>

      <div class="card-grid">
        ${cards.map((card, index) => `
          <div class="card-slot" data-index="${index}" data-flipped="false">
            <div class="card-inner">
              <!-- Front (뒷면) -->
              <div class="card-face card-back">
                <div class="card-back-pattern"></div>
              </div>
              <!-- Back (앞면) -->
              <div class="card-face card-front">
                <img src="${card.image}" alt="${card.name}">
                <div class="card-info">
                  <h3 class="card-name">${card.name}</h3>
                  <p class="card-type">${card.type}</p>
                  <p class="card-rarity rarity-${card.rarity}">${card.rarity.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  app.innerHTML = html;

  initCardFlip(cards);
}

function initCardFlip(cards) {
  const slots = document.querySelectorAll('.card-slot');
  let flippedCount = 0;

  // 개별 클릭
  slots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
      if (slot.dataset.flipped === 'true') return;

      flipCard(slot, cards[index]);
      flippedCount++;

      if (flippedCount === 10) {
        setTimeout(() => setState('summary', { cards }), 1000);
      }
    });
  });

  // 모두 공개
  document.getElementById('revealAllBtn').addEventListener('click', () => {
    slots.forEach((slot, index) => {
      if (slot.dataset.flipped === 'false') {
        setTimeout(() => {
          flipCard(slot, cards[index]);
        }, index * 150); // Stagger
      }
    });

    setTimeout(() => setState('summary', { cards }), slots.length * 150 + 1000);
  });
}

function flipCard(slot, card) {
  slot.dataset.flipped = 'true';
  slot.classList.add('flipped');

  // 레어리티별 효과
  if (card.rarity === 'epic' || card.rarity === 'mythic') {
    slot.classList.add('glare-sweep');
    // 사운드 재생 (Phase 8에서 구현)
  }
}
```

#### CSS (grid.css)
```css
.reveal-stage {
  padding: var(--spacing-xl);
  text-align: center;
}

.reveal-all-btn {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-epic);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.card-slot {
  aspect-ratio: 2/3;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-slot.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-back-pattern {
  width: 80%;
  height: 80%;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(255,255,255,0.1) 0deg 90deg,
    transparent 90deg 180deg
  );
}

.card-front {
  transform: rotateY(180deg);
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
}

.card-front img {
  width: 100%;
  height: 70%;
  object-fit: cover;
}

.card-info {
  padding: var(--spacing-xs);
  text-align: center;
}

.card-name {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.card-type {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.card-rarity {
  font-size: 0.7rem;
  font-weight: bold;
  margin-top: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.rarity-common { background: var(--color-common); color: black; }
.rarity-rare { background: var(--color-rare); }
.rarity-epic { background: var(--color-epic); }
.rarity-mythic { background: var(--color-mythic); color: black; }

/* 글레어 스윕 (레어 카드) */
.card-slot.glare-sweep::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  animation: glare 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

@keyframes glare {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

#### 체크리스트
- [ ] 10장 그리드 렌더링
- [ ] 카드 클릭 시 플립 애니메이션
- [ ] "모두 공개" 버튼 순차 플립 (stagger)
- [ ] 10장 모두 공개 후 summary로 전환
- [ ] 레어 카드 글레어 효과

---

### Task 4.2: 결과 요약 패널
**소요 시간**: 30분
**의존성**: Task 4.1

#### 작업 내용
```javascript
// scripts/main.js에 추가

function renderSummary(cards) {
  const app = document.getElementById('app');

  // 통계 계산
  const stats = {
    common: cards.filter(c => c.rarity === 'common').length,
    rare: cards.filter(c => c.rarity === 'rare').length,
    epic: cards.filter(c => c.rarity === 'epic').length,
    mythic: cards.filter(c => c.rarity === 'mythic').length
  };

  const html = `
    <div class="summary-panel liquid-glass-panel">
      <h2>Pack Opened!</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Common</span>
          <span class="stat-value rarity-common">${stats.common}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Rare</span>
          <span class="stat-value rarity-rare">${stats.rare}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Epic</span>
          <span class="stat-value rarity-epic">${stats.epic}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Mythic</span>
          <span class="stat-value rarity-mythic">${stats.mythic}</span>
        </div>
      </div>

      <div class="action-buttons">
        <button id="toInventoryBtn" class="primary-btn">View Inventory</button>
        <button id="openAnotherBtn" class="secondary-btn">Open Another Pack</button>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // 인벤토리에 저장
  saveToInventory(cards);

  // 이벤트
  document.getElementById('toInventoryBtn').addEventListener('click', () => {
    setState('inventory');
  });

  document.getElementById('openAnotherBtn').addEventListener('click', () => {
    setState('selectingPack');
  });
}
```

#### CSS
```css
.summary-panel {
  max-width: 600px;
  margin: 5rem auto;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  padding: var(--spacing-sm);
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.primary-btn, .secondary-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-btn {
  background: var(--color-epic);
  color: white;
}

.secondary-btn {
  background: transparent;
  border: 2px solid var(--color-rare);
  color: var(--color-rare);
}
```

#### 체크리스트
- [ ] 레어리티별 통계 정확
- [ ] 리퀴드글라스 효과 적용
- [ ] 인벤토리 저장 동작
- [ ] 버튼 동작 확인

---

## 📦 Phase 5: 인벤토리 시스템

### Task 5.1: localStorage 저장/로드
**소요 시간**: 40분
**의존성**: Phase 4

#### 작업 내용
```javascript
// scripts/inventory.js

const STORAGE_KEY = 'mystic_gacha_inventory';

// 인벤토리 로드
export function loadInventory() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 인벤토리 저장
export function saveToInventory(newCards) {
  const inventory = loadInventory();

  newCards.forEach(card => {
    const existing = inventory.find(item => item.cardId === card.id);

    if (existing) {
      // 중복 카운트 증가
      existing.count++;
      existing.lastObtained = Date.now();
    } else {
      // 새 카드 추가
      inventory.push({
        cardId: card.id,
        name: card.name,
        rarity: card.rarity,
        type: card.type,
        image: card.image,
        flavor: card.flavor,
        count: 1,
        firstObtained: Date.now(),
        lastObtained: Date.now()
      });
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  return inventory;
}

// 인벤토리 정렬
export function sortInventory(inventory, criteria = 'rarity') {
  const rarityOrder = { mythic: 4, epic: 3, rare: 2, common: 1 };

  switch (criteria) {
    case 'rarity':
      return [...inventory].sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
    case 'name':
      return [...inventory].sort((a, b) => a.name.localeCompare(b.name));
    case 'count':
      return [...inventory].sort((a, b) => b.count - a.count);
    case 'recent':
      return [...inventory].sort((a, b) => b.lastObtained - a.lastObtained);
    default:
      return inventory;
  }
}

// 인벤토리 필터
export function filterInventory(inventory, filters = {}) {
  return inventory.filter(item => {
    if (filters.rarity && item.rarity !== filters.rarity) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}
```

#### 체크리스트
- [ ] localStorage 저장/로드 동작
- [ ] 중복 카드 카운트 증가
- [ ] 정렬 기능 (레어리티, 이름, 개수, 최근)
- [ ] 필터 기능 (레어리티, 종족, 검색)

---

### Task 5.2: 인벤토리 UI 렌더링
**소요 시간**: 1시간 20분
**의존성**: Task 5.1

#### 작업 내용
```javascript
// scripts/main.js에 추가

function renderInventory() {
  const app = document.getElementById('app');

  let inventory = loadInventory();
  let currentSort = 'rarity';
  let currentFilters = {};

  const render = () => {
    const filtered = filterInventory(inventory, currentFilters);
    const sorted = sortInventory(filtered, currentSort);

    const html = `
      <div class="inventory-view">
        <div class="inventory-header">
          <h2>My Collection (${inventory.length} unique cards)</h2>
          <button id="backToMenuBtn" class="secondary-btn">Back to Menu</button>
        </div>

        <div class="inventory-controls">
          <div class="sort-controls">
            <label>Sort by:</label>
            <select id="sortSelect">
              <option value="rarity">Rarity</option>
              <option value="name">Name</option>
              <option value="count">Count</option>
              <option value="recent">Recent</option>
            </select>
          </div>

          <div class="filter-controls">
            <select id="rarityFilter">
              <option value="">All Rarities</option>
              <option value="mythic">Mythic</option>
              <option value="epic">Epic</option>
              <option value="rare">Rare</option>
              <option value="common">Common</option>
            </select>

            <select id="typeFilter">
              <option value="">All Types</option>
              <option value="Dragon">Dragon</option>
              <option value="Cyborg">Cyborg</option>
              <option value="Spirit">Spirit</option>
              <option value="Elemental">Elemental</option>
              <option value="Beast">Beast</option>
            </select>

            <input type="text" id="searchInput" placeholder="Search cards...">
          </div>
        </div>

        <div class="inventory-grid">
          ${sorted.map(item => `
            <div class="inventory-card rarity-${item.rarity}">
              <div class="card-count-badge">x${item.count}</div>
              <img src="${item.image}" alt="${item.name}">
              <div class="inventory-card-info">
                <h4>${item.name}</h4>
                <p class="card-type">${item.type}</p>
                <p class="card-rarity rarity-${item.rarity}">${item.rarity.toUpperCase()}</p>
              </div>
            </div>
          `).join('')}
        </div>

        ${sorted.length === 0 ? '<p class="empty-state">No cards found</p>' : ''}
      </div>
    `;

    app.innerHTML = html;

    // 이벤트 리스너
    document.getElementById('sortSelect').value = currentSort;
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      currentSort = e.target.value;
      render();
    });

    document.getElementById('rarityFilter').addEventListener('change', (e) => {
      currentFilters.rarity = e.target.value || undefined;
      render();
    });

    document.getElementById('typeFilter').addEventListener('change', (e) => {
      currentFilters.type = e.target.value || undefined;
      render();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
      currentFilters.search = e.target.value || undefined;
      render();
    });

    document.getElementById('backToMenuBtn').addEventListener('click', () => {
      setState('selectingPack');
    });
  };

  render();
}
```

#### CSS
```css
.inventory-view {
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.inventory-controls {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: 12px;
}

.filter-controls {
  display: flex;
  gap: var(--spacing-sm);
}

select, input[type="text"] {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-dark);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.inventory-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s;
  border: 2px solid transparent;
}

.inventory-card:hover {
  transform: translateY(-5px);
}

.inventory-card.rarity-mythic {
  border-color: var(--color-mythic);
}

.inventory-card.rarity-epic {
  border-color: var(--color-epic);
}

.card-count-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.8rem;
  z-index: 10;
}

.inventory-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.inventory-card-info {
  padding: var(--spacing-sm);
  text-align: center;
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  margin-top: var(--spacing-xl);
  font-size: 1.2rem;
}
```

#### 체크리스트
- [ ] 인벤토리 카드 렌더링
- [ ] 정렬 드롭다운 동작
- [ ] 레어리티 필터 동작
- [ ] 종족 필터 동작
- [ ] 검색 기능 동작
- [ ] 카운트 배지 표시

---

## 🎯 Phase 6: 천장 시스템

### Task 6.1: Pity 로직 검증 및 테스트
**소요 시간**: 1시간
**의존성**: Task 1.3, Task 2.1

#### 작업 내용
```javascript
// scripts/packs.js의 draw10Cards() 함수 검증

// 테스트 케이스 작성
export function testPitySystem() {
  console.log('=== Pity System Test ===');

  // Test 1: Epic 천장 (30회)
  let pity = { pullsSinceLastEpic: 29, pullsSinceLastMythic: 50, totalPulls: 50 };
  const result1 = draw10Cards('pack_universal', pity);
  const hasEpicOrMythic = result1.some(c => c.rarity === 'epic' || c.rarity === 'mythic');
  console.log('Epic Pity Test (29회 후):', hasEpicOrMythic ? 'PASS' : 'FAIL');
  console.log('Epic Counter Reset:', pity.pullsSinceLastEpic === 0 ? 'PASS' : 'FAIL');

  // Test 2: Mythic 천장 (90회)
  pity = { pullsSinceLastEpic: 0, pullsSinceLastMythic: 89, totalPulls: 89 };
  const result2 = draw10Cards('pack_universal', pity);
  const hasMythic = result2.some(c => c.rarity === 'mythic');
  console.log('Mythic Pity Test (89회 후):', hasMythic ? 'PASS' : 'FAIL');
  console.log('Mythic Counter Reset:', pity.pullsSinceLastMythic === 0 ? 'PASS' : 'FAIL');

  // Test 3: 확률 분포 (1000회 시뮬레이션)
  const distribution = { common: 0, rare: 0, epic: 0, mythic: 0 };
  pity = { pullsSinceLastEpic: 0, pullsSinceLastMythic: 0, totalPulls: 0 };

  for (let i = 0; i < 100; i++) {
    const cards = draw10Cards('pack_universal', pity);
    cards.forEach(c => distribution[c.rarity]++);
  }

  console.log('Distribution after 1000 pulls:');
  console.log('Common:', (distribution.common / 1000 * 100).toFixed(1) + '% (expected ~70%)');
  console.log('Rare:', (distribution.rare / 1000 * 100).toFixed(1) + '% (expected ~20%)');
  console.log('Epic:', (distribution.epic / 1000 * 100).toFixed(1) + '% (expected ~9%)');
  console.log('Mythic:', (distribution.mythic / 1000 * 100).toFixed(1) + '% (expected ~1%)');
}

// main.js에서 호출 (개발 중)
// testPitySystem();
```

#### 체크리스트
- [ ] Epic 천장 29회 후 보장 확인
- [ ] Mythic 천장 89회 후 보장 확인
- [ ] 카운터 정확히 리셋 확인
- [ ] 1000회 시뮬레이션 확률 분포 합리적 확인

---

### Task 6.2: Pity UI 개선
**소요 시간**: 30분
**의존성**: Task 2.3

#### 작업 내용
```css
/* Pity Bar 개선 */
.pity-bar {
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.3);
}

.pity-item strong {
  font-size: 1.2rem;
  color: var(--color-epic);
}

.progress-bar {
  position: relative;
}

.progress-bar > div {
  position: relative;
  overflow: visible;
}

/* 임계 표시 (90% 이상 시 경고) */
.progress-bar > div.warning {
  background: linear-gradient(90deg, var(--color-mythic), #ef4444);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

```javascript
// main.js의 updatePityUI() 개선
function updatePityUI() {
  // ... 기존 코드 ...

  const epicProgress = document.getElementById('epicProgress');
  const mythicProgress = document.getElementById('mythicProgress');

  // 90% 이상 시 경고 표시
  if (pityCounter.pullsSinceLastEpic >= 27) {
    epicProgress.classList.add('warning');
  } else {
    epicProgress.classList.remove('warning');
  }

  if (pityCounter.pullsSinceLastMythic >= 81) {
    mythicProgress.classList.add('warning');
  } else {
    mythicProgress.classList.remove('warning');
  }
}
```

#### 체크리스트
- [ ] 프로그레스 바 시각적 개선
- [ ] 90% 이상 시 경고 색상/애니메이션
- [ ] 숫자 폰트 크기 가독성

---

## ✨ Phase 7: 홀로그래픽 효과

### Task 7.1: 3D 틸트 효과
**소요 시간**: 1시간
**의존성**: Task 4.1

#### 작업 내용
```javascript
// scripts/reveal.js에 추가

function add3DTilt(cardElement) {
  const card = cardElement.querySelector('.card-inner');

  cardElement.addEventListener('mousemove', (e) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // -10 ~ 10도
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `
      rotateY(${card.classList.contains('flipped') ? 180 + rotateY : rotateY}deg)
      rotateX(${rotateX}deg)
      scale3d(1.05, 1.05, 1.05)
    `;
  });

  cardElement.addEventListener('mouseleave', () => {
    const isFlipped = card.closest('.card-slot').dataset.flipped === 'true';
    card.style.transform = `rotateY(${isFlipped ? 180 : 0}deg) rotateX(0deg) scale3d(1, 1, 1)`;
  });
}

// initCardFlip() 함수에서 호출
function initCardFlip(cards) {
  const slots = document.querySelectorAll('.card-slot');

  slots.forEach((slot, index) => {
    // 기존 플립 로직...

    // 3D 틸트 추가
    add3DTilt(slot);
  });
}
```

#### CSS (holo-card.css)
```css
.card-inner {
  transition: transform 0.1s ease-out;
}

.card-slot {
  transform-style: preserve-3d;
}
```

#### 체크리스트
- [ ] 마우스 이동 시 카드 틸트
- [ ] 마우스 나가면 원위치
- [ ] 플립 상태에서도 틸트 동작
- [ ] 60fps 유지

---

### Task 7.2: 홀로그래픽 글레어 효과
**소요 시간**: 1시간
**의존성**: Task 7.1

#### 작업 내용
```css
/* styles/holo-card.css */

.card-front {
  position: relative;
  overflow: visible;
}

/* 홀로그래픽 오버레이 */
.card-front::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    conic-gradient(
      from 0deg at 50% 50%,
      rgba(255, 0, 0, 0.2) 0deg,
      rgba(255, 255, 0, 0.2) 60deg,
      rgba(0, 255, 0, 0.2) 120deg,
      rgba(0, 255, 255, 0.2) 180deg,
      rgba(0, 0, 255, 0.2) 240deg,
      rgba(255, 0, 255, 0.2) 300deg,
      rgba(255, 0, 0, 0.2) 360deg
    );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  mix-blend-mode: color-dodge;
}

/* 플립 후 홀로 효과 활성화 */
.card-slot.flipped .card-front::before {
  opacity: 0.6;
}

/* Epic/Mythic은 더 강한 효과 */
.card-slot.flipped.rarity-epic .card-front::before,
.card-slot.flipped.rarity-mythic .card-front::before {
  opacity: 0.9;
  animation: rainbow-shift 3s linear infinite;
}

@keyframes rainbow-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* 스파클 파티클 */
.card-slot.flipped.rarity-mythic .card-front::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle, white 1px, transparent 1px),
    radial-gradient(circle, white 1px, transparent 1px);
  background-size: 50px 50px, 80px 80px;
  background-position: 0 0, 40px 40px;
  opacity: 0.3;
  animation: sparkle 2s linear infinite;
  pointer-events: none;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}
```

```javascript
// reveal.js의 flipCard() 수정
function flipCard(slot, card) {
  slot.dataset.flipped = 'true';
  slot.classList.add('flipped');
  slot.classList.add(`rarity-${card.rarity}`); // 레어리티 클래스 추가

  if (card.rarity === 'epic' || card.rarity === 'mythic') {
    slot.classList.add('glare-sweep');
  }
}
```

#### 체크리스트
- [ ] Conic gradient 홀로 효과 표시
- [ ] Epic/Mythic 더 강한 효과
- [ ] Rainbow shift 애니메이션
- [ ] Mythic 스파클 파티클

---

## 🔊 Phase 8: 사운드 시스템

### Task 8.1: 사운드 에셋 준비
**소요 시간**: 30분
**의존성**: 없음

#### 작업 내용
Freesound.org 또는 Zapsplat에서 다운로드:

1. **whoosh-soft.mp3** (Common) - 부드러운 윙 소리
2. **chime.mp3** (Rare) - 차임벨 소리
3. **fanfare.mp3** (Epic) - 짧은 팡파레
4. **reveal-epic.mp3** (Mythic) - 드라마틱한 리빌 사운드
5. **pack-tear.mp3** - 팩 개봉 소리

파일을 `assets/sounds/` 에 저장

#### 추천 검색 키워드
- Common: "soft whoosh", "card flip"
- Rare: "chime bell", "notification"
- Epic: "fanfare short", "success"
- Mythic: "epic reveal", "dramatic"
- Pack: "paper tear", "rip"

#### 체크리스트
- [ ] 5개 사운드 파일 다운로드
- [ ] MP3 포맷 확인
- [ ] 각 파일 < 200KB
- [ ] assets/sounds/ 폴더에 저장

---

### Task 8.2: Howler.js 사운드 시스템
**소요 시간**: 1시간
**의존성**: Task 8.1

#### 작업 내용
```javascript
// scripts/sound.js (새 파일)

let soundEnabled = true;
let volume = 0.5;

const sounds = {
  common: new Howl({ src: ['assets/sounds/whoosh-soft.mp3'], volume: volume }),
  rare: new Howl({ src: ['assets/sounds/chime.mp3'], volume: volume }),
  epic: new Howl({ src: ['assets/sounds/fanfare.mp3'], volume: volume }),
  mythic: new Howl({ src: ['assets/sounds/reveal-epic.mp3'], volume: volume }),
  packTear: new Howl({ src: ['assets/sounds/pack-tear.mp3'], volume: volume })
};

export function playSound(type) {
  if (!soundEnabled) return;

  if (sounds[type]) {
    sounds[type].play();
  }
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function setVolume(val) {
  volume = Math.max(0, Math.min(1, val));
  Object.values(sounds).forEach(sound => {
    sound.volume(volume);
  });
}

export function getVolume() {
  return volume;
}

export function isSoundEnabled() {
  return soundEnabled;
}
```

```javascript
// main.js에 추가
import { playSound, toggleSound, isSoundEnabled } from './sound.js';

// 볼륨 토글 버튼
document.getElementById('volumeToggle').addEventListener('click', () => {
  const enabled = toggleSound();
  document.getElementById('volumeToggle').textContent = enabled ? '🔊' : '🔇';
});
```

```javascript
// reveal.js의 flipCard() 수정
import { playSound } from './sound.js';

function flipCard(slot, card) {
  slot.dataset.flipped = 'true';
  slot.classList.add('flipped');
  slot.classList.add(`rarity-${card.rarity}`);

  // 사운드 재생
  playSound(card.rarity);

  if (card.rarity === 'epic' || card.rarity === 'mythic') {
    slot.classList.add('glare-sweep');
  }
}
```

```javascript
// open-stage.js의 completeTearing() 수정
import { playSound } from './sound.js';

function completeTearing(pack) {
  playSound('packTear');
  // ... 기존 코드
}
```

#### 체크리스트
- [ ] Howler.js 로드 확인
- [ ] 사운드 파일 재생 확인
- [ ] 볼륨 토글 버튼 동작
- [ ] 카드 플립 시 레어리티별 사운드
- [ ] 팩 개봉 시 사운드

---

## 💎 Phase 9: 리퀴드글라스 UI

### Task 9.1: 헤더 스타일 개선
**소요 시간**: 30분
**의존성**: Task 2.2

#### 작업 내용
```css
/* styles/liquid-glass.css 개선 */

.liquid-glass-header {
  backdrop-filter: blur(var(--blur-amount)) saturate(180%);
  background: rgba(15, 23, 42, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.liquid-glass-header h1 {
  background: linear-gradient(135deg, var(--color-rare), var(--color-epic), var(--color-mythic));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.controls {
  display: flex;
  gap: var(--spacing-sm);
}

.controls button {
  padding: var(--spacing-xs) var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}

.controls button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

#### 체크리스트
- [ ] 헤더 블러 효과 확인
- [ ] 타이틀 그라데이션 텍스트
- [ ] 버튼 호버 효과
- [ ] Safari 호환성 확인

---

### Task 9.2: 결과 패널 리퀴드글라스 적용
**소요 시간**: 30분
**의존성**: Task 4.2, Task 9.1

#### 작업 내용
```css
/* styles/liquid-glass.css에 추가 */

.summary-panel {
  backdrop-filter: blur(var(--blur-amount)) saturate(180%);
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.summary-panel h2 {
  background: linear-gradient(135deg, white, var(--color-rare));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-lg);
}
```

#### 체크리스트
- [ ] 결과 패널 블러 효과
- [ ] 내부 하이라이트 표시
- [ ] 그림자 효과 적절
- [ ] 가독성 확인

---

## 🧪 Phase 10: 테스트 & 폴리싱

### Task 10.1: 기능 테스트
**소요 시간**: 1시간
**의존성**: 모든 Phase

#### 테스트 체크리스트
- [ ] **팩 선택**: 팩 카드 렌더링, 클릭 동작
- [ ] **드래그 뜯기**: 진행도 표시, 100% 도달 시 전환, 중간 이탈 시 리셋
- [ ] **카드 공개**:
  - [ ] 10장 그리드 렌더링
  - [ ] 수동 클릭 플립
  - [ ] "모두 공개" 순차 플립
  - [ ] 레어리티별 사운드
  - [ ] 홀로그래픽 효과
- [ ] **천장 시스템**:
  - [ ] Epic 30회 보장
  - [ ] Mythic 90회 보장
  - [ ] UI 프로그레스 바 정확
- [ ] **인벤토리**:
  - [ ] localStorage 저장
  - [ ] 중복 카운트
  - [ ] 정렬 (4가지)
  - [ ] 필터 (레어리티, 종족, 검색)
- [ ] **사운드**:
  - [ ] 레어리티별 사운드 재생
  - [ ] 볼륨 토글
  - [ ] 팩 개봉 사운드
- [ ] **UI/UX**:
  - [ ] 헤더 고정
  - [ ] Pity 바 하단 고정
  - [ ] 리퀴드글라스 효과
  - [ ] 모든 버튼 동작

---

### Task 10.2: 크로스 브라우저 테스트
**소요 시간**: 30분
**의존성**: Task 10.1

#### 테스트 브라우저
- [ ] Chrome (최신)
- [ ] Firefox (최신)
- [ ] Safari (최신)
- [ ] Edge (최신)

#### 확인 사항
- [ ] backdrop-filter 지원 (Safari fallback)
- [ ] GSAP 애니메이션
- [ ] Howler.js 사운드 재생
- [ ] localStorage 동작
- [ ] CSS Grid 레이아웃

---

### Task 10.3: 성능 최적화
**소요 시간**: 30분
**의존성**: Task 10.2

#### 최적화 항목
```javascript
// 카드 이미지 lazy loading
<img src="${card.image}" alt="${card.name}" loading="lazy">

// 이벤트 리스너 최적화 (debounce)
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

document.getElementById('searchInput').addEventListener('input',
  debounce((e) => {
    currentFilters.search = e.target.value || undefined;
    render();
  }, 300)
);

// CSS transform 최적화
.card-inner {
  will-change: transform;
}
```

#### 체크리스트
- [ ] 이미지 lazy loading
- [ ] 검색 입력 debounce
- [ ] 애니메이션 60fps
- [ ] localStorage 용량 관리 (5MB 이내)

---

### Task 10.4: README.md 작성
**소요 시간**: 30분 - 1시간
**의존성**: Task 10.3

#### README 구조
```markdown
# Mystic Gacha - Card Pack Simulator

홀로그래픽 효과와 리퀴드글라스 UI를 갖춘 10연 카드 뽑기 시뮬레이터

## 🎯 Features

- 10연 카드팩 개봉 시스템
- 드래그로 팩 뜯기 인터랙션
- 홀로그래픽 카드 효과 (pokemon-cards-css 스타일)
- 천장 시스템 (Epic 30회, Mythic 90회)
- 레어리티별 사운드
- 인벤토리 관리 (필터/정렬)
- 리퀴드글라스 UI

## 🛠 Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- GSAP 3.x (애니메이션)
- Howler.js 2.x (사운드)
- localStorage (데이터 저장)

## 🚀 How to Run

1. 저장소 클론 또는 다운로드
2. `index.html`을 브라우저에서 열기
3. (선택) 로컬 서버 실행:
   ```bash
   npx serve .
   # 또는
   python -m http.server 8000
   ```

## 📸 Screenshots

[GIF1: 팩 개봉]
[GIF2: 카드 공개]
[GIF3: 인벤토리]

## 🎮 Usage

1. **팩 선택**: Universal Pack 클릭
2. **팩 개봉**: 우측으로 드래그하여 개봉
3. **카드 공개**: 카드 클릭 또는 "Reveal All" 버튼
4. **인벤토리**: 📦 버튼으로 컬렉션 확인

## 🎨 Card Types

- **Dragon**: 신비한 용 계열
- **Cyborg**: 사이버네틱 기계
- **Spirit**: 영적 존재
- **Elemental**: 원소 정령
- **Beast**: 야생 생명체

## 📊 Rarity System

| Rarity | Probability | Pity |
|--------|-------------|------|
| Common | 70% | - |
| Rare | 20% | - |
| Epic | 9% | 30회 |
| Mythic | 1% | 90회 |

## 🔊 Sound Credits

- 모든 사운드는 Freesound.org와 Zapsplat의 CC0/Attribution 라이선스

## 📝 Development

자세한 개발 문서는 `DEVELOP.md` 참고

## 📄 License

MIT License

## 👨‍💻 Author

VibeCoding Project
```

#### 체크리스트
- [ ] Features 목록
- [ ] 실행 방법
- [ ] 스크린샷/GIF 3개
- [ ] 기술 스택
- [ ] 사용 방법
- [ ] 라이선스

---

## 🎯 Final Checklist (전체 완료 확인)

### Core Flow (P0)
- [ ] 팩 선택 → 개봉 → 카드 공개 → 인벤토리 전체 플로우
- [ ] localStorage 데이터 영속성
- [ ] 천장 시스템 정확도 100%

### Visual & Audio (P1)
- [ ] 홀로그래픽 효과 동작
- [ ] 리퀴드글라스 UI 적용
- [ ] 레어리티별 사운드 재생

### Polish
- [ ] 모든 애니메이션 60fps
- [ ] 크로스 브라우저 테스트 통과
- [ ] README.md 작성
- [ ] GIF 데모 3개 제작

---

## 📌 Notes & Tips

### 개발 중 주의사항
1. **localStorage 용량**: 주기적으로 확인, 5MB 초과 방지
2. **사운드 자동재생**: 사용자 클릭 후 재생 (브라우저 정책)
3. **이미지 로딩**: Unsplash URL 변경 가능성, fallback 준비
4. **CSS 변수**: 테마 변경 시 base.css만 수정

### 확장 아이디어 (v2.0)
- 종족별 전용 팩
- 카드 애니메이션 커스터마이징
- 소셜 공유 기능
- 다국어 지원
- 모바일 최적화

---

**문서 버전**: 1.0
**최종 수정**: 2025-10-29
