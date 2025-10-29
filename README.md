# Mystic Gacha - Card Pack Simulator

홀로그래픽 효과와 리퀴드글라스 UI를 갖춘 10연 카드 뽑기 시뮬레이터

![Mystic Gacha](https://images.unsplash.com/photo-1618588507085-c79565432917?w=800&h=400&fit=crop)

## 🎯 주요 기능 (Features)

### 카드 시스템
- **40장의 고유 카드**: Dragon, Cyborg, Spirit, Elemental, Beast 5개 종족
- **4단계 레어리티**: Common (70%), Rare (20%), Epic (9%), Mythic (1%)
- **천장 시스템**: Epic 30회 보장, Mythic 90회 보장
- **인벤토리 관리**: 중복 카드 카운트, 필터링, 정렬 기능

### 인터랙티브 경험
- **드래그 개봉**: 팩을 드래그하여 뜯는 독특한 인터랙션
- **10연 카드 공개**: 한 장씩 클릭 또는 "모두 공개" 버튼
- **3D 틸트 효과**: 마우스 움직임에 반응하는 카드 애니메이션
- **홀로그래픽 효과**: Pokemon-cards-css 스타일의 무지개빛 효과

### UI/UX
- **리퀴드글라스 디자인**: Backdrop blur를 활용한 투명 유리 효과
- **실시간 천장 표시**: 화면 하단에 진행도 바 고정
- **레어리티별 연출**: 등급에 따른 차별화된 시각/청각 효과
- **사운드 시스템**: 레어리티별 사운드 (구조 구현, 사운드 파일 추가 필요)

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Animation**: GSAP 3.x
- **Sound**: Howler.js 2.x (구조만 구현, 사운드 파일 추가 필요)
- **Storage**: localStorage API
- **Assets**: Unsplash (placeholder 이미지)

## 🚀 실행 방법 (How to Run)

### 방법 1: 직접 열기
1. 저장소를 클론하거나 다운로드합니다
   ```bash
   git clone <repository-url>
   cd VibeCoding
   ```

2. `index.html` 파일을 브라우저에서 엽니다
   - 파일 탐색기에서 `index.html`을 더블클릭
   - 또는 브라우저에 파일을 드래그 앤 드롭

### 방법 2: 로컬 서버 (권장)
```bash
# npx serve 사용
npx serve .

# 또는 Python 사용
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

## 🎮 사용 방법 (Usage)

1. **팩 선택**: "Universal Pack" 카드를 클릭하여 선택
2. **팩 개봉**: 팩 이미지를 우측으로 드래그하여 100%까지 진행
3. **카드 공개**:
   - 카드를 개별 클릭하여 한 장씩 공개
   - 또는 "✨ Reveal All" 버튼으로 모두 공개
4. **인벤토리**: 📦 Inventory 버튼으로 컬렉션 확인
   - 레어리티, 종족별 필터링
   - 이름, 개수, 최근 획득순 정렬
   - 카드 검색 기능

## 🎨 카드 종족 (Card Types)

| 종족 | 설명 | 카드 수 |
|------|------|---------|
| **Dragon** | 신비한 용 계열 | 8장 |
| **Cyborg** | 사이버네틱 기계 | 8장 |
| **Spirit** | 영적 존재 | 8장 |
| **Elemental** | 원소 정령 | 8장 |
| **Beast** | 야생 생명체 | 8장 |

## 📊 레어리티 시스템 (Rarity System)

| 레어리티 | 확률 | 천장 | 특수 효과 |
|----------|------|------|-----------|
| **Common** | 70% | - | 기본 플립 애니메이션 |
| **Rare** | 20% | - | 블루 글로우 |
| **Epic** | 9% | 30회 보장 | 퍼플 글로우 + 글레어 스윕 |
| **Mythic** | 1% | 90회 보장 | 골드 글로우 + 스파클 + 무지개 효과 |

## 🔊 사운드 시스템

현재 사운드 시스템의 구조만 구현되어 있습니다. 실제 사운드를 추가하려면:

1. `assets/sounds/` 폴더에 다음 파일을 추가:
   - `whoosh-soft.mp3` - Common 카드 플립
   - `chime.mp3` - Rare 카드
   - `fanfare.mp3` - Epic 카드
   - `reveal-epic.mp3` - Mythic 카드
   - `pack-tear.mp3` - 팩 개봉

2. `scripts/sound.js`의 `initSounds()` 함수 주석 해제

**추천 소스**: Freesound.org, Zapsplat (CC0/Attribution 라이선스)

## 📁 프로젝트 구조 (Project Structure)

```
VibeCoding/
├── index.html              # 메인 HTML
├── styles/
│   ├── base.css           # 기본 스타일 + CSS 변수
│   ├── liquid-glass.css   # 리퀴드글라스 효과
│   ├── pack.css           # 팩 선택/개봉 스타일
│   ├── grid.css           # 카드 그리드 + 플립
│   └── holo-card.css      # 홀로그래픽 효과
├── scripts/
│   ├── main.js            # 상태 머신 + 초기화
│   ├── packs.js           # 확률 시스템
│   ├── open-stage.js      # 팩 선택/개봉
│   ├── reveal.js          # 카드 공개
│   ├── inventory.js       # 인벤토리 관리
│   └── sound.js           # 사운드 시스템
├── data/
│   ├── cards.json         # 40장 카드 데이터
│   └── packs.json         # 팩 설정
└── assets/
    ├── images/            # (플레이스홀더 - Unsplash)
    ├── sounds/            # (사운드 파일 추가 필요)
    └── textures/          # (선택사항)
```

## 🎯 개발 과정 (Development)

이 프로젝트는 다음 단계로 개발되었습니다:

- **Phase 0-1**: 프로젝트 설정 + 데이터 레이어
- **Phase 2**: UI 기반 + 상태 머신
- **Phase 3**: 팩 선택 + 드래그 개봉
- **Phase 4**: 카드 공개 시스템
- **Phase 5**: 인벤토리 시스템
- **Phase 6**: 사운드 시스템 구조
- **Phase 7**: 홀로그래픽 효과

자세한 개발 문서는 `DEVELOP.md` 참고

## 🌐 브라우저 호환성 (Browser Compatibility)

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**참고**: `backdrop-filter`를 지원하지 않는 브라우저에서는 fallback 스타일이 적용됩니다.

## 📱 반응형

- **데스크톱 우선** (1920x1080 기준)
- 태블릿/모바일에서는 성능 최적화를 위해 일부 효과 비활성화
- 모바일에서는 3D 틸트 및 복잡한 애니메이션 제거

## ⚡ 성능 최적화

- Lazy loading 이미지
- CSS `will-change` 속성 활용
- 모바일에서 애니메이션 자동 비활성화
- localStorage 용량 관리 (5MB 이내)

## 🔮 향후 개발 계획 (Future Enhancements)

- [ ] 종족별 전용 카드팩
- [ ] 실제 사운드 파일 추가
- [ ] 카드 상세보기 모달
- [ ] 통계 대시보드 (Chart.js)
- [ ] 다국어 지원
- [ ] 소셜 공유 기능
- [ ] 모바일 최적화 개선
- [ ] 카드 애니메이션 커스터마이징

## 🐛 알려진 이슈 (Known Issues)

- 사운드 파일이 없어 콘솔에 로그만 출력됩니다
- Safari에서 `backdrop-filter` 성능이 낮을 수 있습니다
- 빠른 클릭 시 애니메이션이 겹칠 수 있습니다

## 📝 라이선스 (License)

MIT License

## 👨‍💻 개발자 (Author)

VibeCoding Project

---

## 🎓 바이브코딩 제출용

이 프로젝트는 바이브코딩 과제로 제작되었습니다.

**구현된 기능**:
- ✅ 팩 선택 UI
- ✅ 드래그 개봉 인터랙션
- ✅ 10연 카드 뽑기 (확률 시스템)
- ✅ 천장 시스템 (Epic 30회, Mythic 90회)
- ✅ 카드 공개 애니메이션
- ✅ 홀로그래픽 효과
- ✅ 인벤토리 저장/관리
- ✅ 필터링/정렬 기능
- ✅ 리퀴드글라스 UI

**사용 기술**:
- Vanilla JavaScript (ES6 Modules)
- CSS3 (Grid, Flexbox, Animations)
- GSAP (애니메이션 라이브러리)
- localStorage (데이터 저장)

**특징**:
- 빌드 과정 없이 바로 실행 가능
- 모던 웹 기술 활용
- 반응형 디자인
- 접근성 고려 (reduced motion 지원)
