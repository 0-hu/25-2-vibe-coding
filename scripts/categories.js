// 카테고리 정의 모듈

export const CATEGORIES = [
  {
    id: 'pattern',
    label: '패턴',
    keywords: ['pattern', 'patterns', 'texture'],
  },
  {
    id: 'animals',
    label: '동물',
    keywords: ['animal', 'animals', 'wildlife'],
  },
  {
    id: 'meme',
    label: '밈',
    keywords: ['meme', 'funny'],
  },
  {
    id: 'people',
    label: '사람',
    keywords: ['people', 'portrait'],
  },
  {
    id: 'random',
    label: '무작위',
    keywords: ['random'],
  },
];

export function getCategoryInfo(id) {
  return CATEGORIES.find((cat) => cat.id === id);
}

export function getCategoryKeywords(id) {
  const category = getCategoryInfo(id);
  return category?.keywords || [];
}
