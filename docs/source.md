# 🐾 Simple Random Animal Image Sources  
`picsum`처럼 간단하게 랜덤 동물 이미지를 불러올 수 있는 무료 소스 정리 (모두 무료, API Key 불필요)

---

## 🐶 Dog CEO API
> 전 세계 강아지 품종 랜덤 이미지 제공

- ✅ JSON 응답 (JS 필요)  
- ❌ API Key 불필요  
- 🐕 품종별 필터 가능 (`/breed/husky/images/random`)  

```js
fetch("https://dog.ceo/api/breeds/image/random")
  .then(r => r.json())
  .then(d => document.body.innerHTML = `<img src="${d.message}" alt="Dog">`);
예시 결과 →

🐱 The Cat API
랜덤 고양이 이미지, 해상도 및 MIME 타입 옵션 제공

✅ JSON 응답 (JS 필요)

❌ API Key 불필요 (선택적으로 가능)

🐈 파라미터: mime_types=jpg,png, size=small, limit=1 등

js
코드 복사
fetch("https://api.thecatapi.com/v1/images/search")
  .then(r => r.json())
  .then(d => document.body.innerHTML = `<img src="${d[0].url}" alt="Cat">`);
예시 결과 →

🦊 RandomFox API
귀여운 여우 랜덤 이미지, 빠른 응답 속도

✅ JSON 응답 (JS 필요)

❌ API Key 불필요

js
코드 복사
fetch("https://randomfox.ca/floof/")
  .then(r => r.json())
  .then(d => document.body.innerHTML = `<img src="${d.image}" alt="Fox">`);
예시 결과 →

🐦 Shibe.online (Dog, Cat, Bird)
강아지, 고양이, 새 랜덤 이미지 지원 (한 API에서 다 가능)

✅ JSON 응답 (JS 필요)

❌ API Key 불필요

🐾 엔드포인트: /api/shibes, /api/cats, /api/birds

js
코드 복사
fetch("https://shibe.online/api/shibes?count=1")
  .then(r => r.json())
  .then(d => document.body.innerHTML = `<img src="${d[0]}" alt="Animal">`);
예시 결과 →

🐻 PlaceBear
랜덤 곰 사진 — picsum 스타일 정적 이미지

✅ <img> 바로 사용 가능

❌ API Key 불필요

🐻 사이즈 지정 시 다른 곰 이미지 표시

html
코드 복사
<img src="https://placebear.com/600/400" alt="Bear">
예시 결과 →

🐱 PlaceKitten
랜덤 고양이 사진 — 단일 URL로 테스트에 적합

✅ <img> 바로 사용 가능

❌ API Key 불필요

🐈 흑백 모드 지원 (/g/width/height)

html
코드 복사
<img src="https://placekitten.com/400/300" alt="Kitten">
<img src="https://placekitten.com/g/400/300" alt="Kitten (Grayscale)">
예시 결과 →

✅ 요약
목적	추천 소스
<img> 바로 사용	PlaceKitten / PlaceBear
JS 가능 시	Dog CEO / Cat API / RandomFox / Shibe
고양이 위주	PlaceKitten / The Cat API
귀여운 동물 다양하게	Shibe.online