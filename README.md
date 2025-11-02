# 🐾 동물 월드컵 (Animal World Cup)
<img width="1477" height="1247" alt="image" src="https://github.com/user-attachments/assets/b59320f6-9df5-4264-b02d-4c1d2f38e5c9" />

귀여운 동물들의 토너먼트 게임 - 16장의 동물 이미지를 1:1 대결로 최종 우승자를 가립니다!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📋 프로젝트 개요

사용자가 선택한 동물 카테고리(강아지, 고양이, 여우, 믹스)에서 16장의 이미지를 실시간으로 불러와 토너먼트 방식으로 경기를 진행하는 웹 게임입니다. 레트로 픽셀 아트 감성의 UI로 재미있는 시각 경험을 제공합니다.

## ✨ 주요 기능

### 🎮 게임 기능
- **4가지 카테고리**: 🐶 강아지, 🐱 고양이, 🦊 여우, 🎲 믹스
- **토너먼트 시스템**: 16강 → 8강 → 4강 → 준결승 → 결승 → 우승
- **시간 제한**: 각 매치마다 10초 타이머 (시간 초과 시 랜덤 선택)
- **키보드 지원**: 화살표 키 (← / →)로 빠른 선택
- **실시간 이미지 로딩**: 무료 동물 API에서 실시간으로 이미지 수집
- **결과 저장**: localStorage를 통한 플레이 히스토리 관리

### 🎨 디자인 특징
- **픽셀 아트 UI**: 레트로 8비트 게임 감성
- **Press Start 2P 폰트**: 비트맵 스타일의 픽셀 폰트
- **굵은 픽셀 테두리**: 3px solid 테두리로 명확한 구분
- **픽셀 그림자 효과**: 4px 오프셋 그림자
- **레트로 색상**: 핑크, 시안, 노란색 악센트

### 📱 반응형 디자인
- **Desktop (>1024px)**: 4개 카테고리 1줄 배치, 좌우 비교 레이아웃
- **Tablet (768-1024px)**: 2개 카테고리씩 배치
- **Mobile (<768px)**: 1개 카테고리씩, 상하 배치

## 🚀 실행 방법

### 간단 실행 (추천)
1. `index.html` 파일을 웹 브라우저에서 열기
2. 끝! 바로 게임을 시작할 수 있습니다.

### 로컬 서버 실행 (선택)
CORS 정책으로 인해 일부 브라우저에서 파일 프로토콜(`file://`)로 실행 시 문제가 발생할 수 있습니다. 이 경우 간단한 로컬 서버를 사용하세요:

```bash
# Python 3가 설치되어 있다면
python -m http.server 8000

# 또는 Node.js가 설치되어 있다면
npx serve

# 브라우저에서 http://localhost:8000 접속
```

## 🎯 게임 방법

1. **홈 화면**
   - 4가지 동물 카테고리 중 하나를 선택
   - 각 카테고리는 대표 이미지와 설명으로 구성
   - 믹스 카테고리는 모든 동물을 섞어서 진행
   - "시작하기" 버튼 클릭

2. **로딩 화면**
   - 16장의 동물 이미지가 실시간으로 로딩됩니다
   - 진행률 바로 로딩 상태 확인
   - 로딩 실패 시 자동 재시도 (최대 5회)

3. **게임 화면**
   - 두 이미지 중 마음에 드는 것을 클릭하거나 화살표 키로 선택
   - 각 매치마다 10초의 제한시간
   - 상단에 라운드 정보 표시 (16강, 8강, 4강...)
   - 타이머 바로 남은 시간 확인

4. **결과 화면**
   - 최종 우승 이미지 대형 카드로 표시
   - 전체 순위를 그리드로 확인 (1위~16위)
   - "다시 하기" 또는 "다른 카테고리" 선택

## 📂 프로젝트 구조

```
VibeCoding/
├── index.html              # 메인 HTML 파일
├── README.md               # 프로젝트 문서 (이 파일)
├── .gitignore              # Git 제외 파일 목록
│
├── styles/                 # CSS 스타일시트
│   ├── variables.css       # CSS 변수 (색상, 간격, 폰트 크기 등)
│   ├── main.css            # 전역 스타일 (body, 레이아웃)
│   ├── pixel.css           # 픽셀 아트 스타일 컴포넌트 (버튼, 카드, 배지)
│   └── screens.css         # 화면별 스타일 (홈, 로딩, 게임, 결과)
│
├── scripts/                # JavaScript 파일
│   ├── main.js             # 메인 앱 로직 (통합 버전)
│   └── logger.js           # 디버그 로거 (F2 키로 토글)
│
└── docs/                   # 문서 폴더
    ├── PRD.md              # 제품 요구사항 문서
    ├── revision.md         # 변경 이력
    ├── plan.md             # 개발 계획
    └── source.md           # 이미지 소스 참고
```

## 🛠️ 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: CSS Variables, Flexbox, Grid, Animations
- **Vanilla JavaScript (ES6+)**: 모듈 없는 통합 버전

### 외부 리소스
- **Press Start 2P**: Google Fonts (픽셀 폰트)
- **Dog CEO API**: 강아지 랜덤 이미지 (MIT License)
- **The Cat API**: 고양이 랜덤 이미지 (무료 티어)
- **RandomFox API**: 여우 랜덤 이미지 (무료)

### 데이터 저장
- **localStorage**: 설정, 세션, 히스토리 저장

### 빌드 도구
- 없음 (정적 HTML 직접 실행)

## 🎨 디자인 가이드

### 색상 팔레트
```css
--color-bg: #2d2d3d;              /* 배경 (다크 보라)   */
--color-primary: #ff6b9d;         /* 주요 (핑크)       */
--color-secondary: #4ecdc4;       /* 보조 (시안)       */
--color-accent: #ffe66d;          /* 강조 (노란색)     */
```

### 폰트 크기 (1.3배 확대)
```css
--font-size-xs: 13px;
--font-size-sm: 16px;
--font-size-md: 18px;
--font-size-lg: 23px;
--font-size-xl: 31px;
--font-size-2xl: 42px;
```

### 픽셀 스타일 요소
- **테두리**: 3px solid, 굵은 픽셀 느낌
- **그림자**: 4px 4px 0px (드롭 그림자, 부드러움 없음)
- **버튼**: 호버 시 -2px 이동, 클릭 시 +2px 이동
- **애니메이션**: steps() 함수로 픽셀 애니메이션

## 🌐 데이터 소스

### Dog CEO API
- **URL**: `https://dog.ceo/api/breeds/image/random`
- **라이선스**: MIT License
- **특징**: 다양한 강아지 품종 이미지 제공

### The Cat API
- **URL**: `https://api.thecatapi.com/v1/images/search`
- **라이선스**: 무료 티어 (API Key 불필요)
- **특징**: 고품질 고양이 이미지 제공

### RandomFox API
- **URL**: `https://randomfox.ca/floof/`
- **라이선스**: 무료
- **특징**: 귀여운 여우 이미지 컬렉션

### 믹스 카테고리
- 강아지 5장 + 고양이 6장 + 여우 5장 = 총 16장
- Fisher-Yates 알고리즘으로 무작위 셔플

## 💡 주요 특징

### 이미지 캐싱 시스템
- 카테고리 카드용 이미지는 한 번 로드 후 캐시에 저장
- 카테고리 선택 시 이미지 재로딩 방지
- 빠른 화면 전환 및 네트워크 절약

### 재시도 로직
- API 요청 실패 시 자동 재시도 (최대 5회)
- 각 재시도 간 100ms 딜레이
- 진행률 표시 및 에러 메시지

### 로컬 저장
- 마지막 선택 카테고리 기억
- 플레이 히스토리 저장
- 브라우저를 닫아도 데이터 유지

### 디버그 모드
- F2 키로 디버그 패널 토글
- 로그 필터링 (debug, info, warn, error)
- 실시간 로그 확인

## 🖥️ 브라우저 호환성

- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+

ES6+ 문법을 지원하는 모던 브라우저가 필요합니다.

## 📈 성능 최적화

- **순차 로딩**: 16장의 이미지를 순차적으로 로딩하여 과부하 방지
- **진행률 표시**: 실시간 로딩 상태 피드백
- **이미지 캐싱**: 카테고리 카드 이미지 재사용
- **레이트 리밋 방지**: API 요청 간 100ms 딜레이

## 🔧 개발 정보

### 디자인 원칙
- **간결함**: 불필요한 복잡성 제거
- **즉시성**: 설치나 빌드 없이 바로 실행
- **재미**: 직관적이고 즐거운 사용자 경험
- **레트로**: 향수를 자극하는 픽셀 아트 스타일

### 코드 구조
- **모듈 없는 통합 방식**: 모든 로직을 main.js에 통합
- **명확한 함수 분리**: Storage, Categories, API, Tournament, UI 등
- **상태 관리**: localStorage 기반 간단한 상태 관리
- **에러 처리**: try-catch 및 재시도 로직

## 📝 문서

- **[PRD.md](docs/PRD.md)**: 제품 요구사항 문서 (상세 기획)
- **[revision.md](docs/revision.md)**: 변경 이력 및 버전 정보
- **[plan.md](docs/plan.md)**: 개발 계획 및 일정
- **[source.md](docs/source.md)**: 이미지 소스 참고 자료

## 🚧 향후 개선 사항

### 기능 추가
- [ ] 더 많은 동물 카테고리 (토끼, 새, 판다, 곰 등)
- [ ] 결과 공유 기능 (이미지 다운로드, SNS 공유)
- [ ] 효과음 및 배경음악
- [ ] 32강/64강 옵션
- [ ] 다크 모드 / 라이트 모드

### 최적화
- [ ] 이미지 lazy loading
- [ ] Service Worker 캐싱
- [ ] 성능 모니터링

### 접근성
- [ ] 키보드 네비게이션 개선
- [ ] 스크린 리더 지원 강화
- [ ] 고대비 모드

## 📄 라이선스

MIT License

이 프로젝트는 교육 및 개인 프로젝트 목적으로 제작되었습니다.

## 👤 크레딧

- **개발자**: KwonYoungHu @Kookmin University
- **이미지**: Dog CEO API, The Cat API, RandomFox API
- **폰트**: Press Start 2P (Google Fonts)
- **디자인 영감**: 레트로 8비트 게임

## 🙏 감사의 글

- [Dog CEO](https://dog.ceo/dog-api/) - 무료 강아지 이미지 제공
- [The Cat API](https://thecatapi.com/) - 무료 고양이 이미지 제공
- [RandomFox](https://randomfox.ca/) - 무료 여우 이미지 제공
- [Google Fonts](https://fonts.google.com/) - Press Start 2P 폰트 제공

---

**즐거운 게임 되세요! 🎮🐾**

Copyright © 2025 by KwonYoungHu @Kookmin University
