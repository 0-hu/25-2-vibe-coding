// ============================================
// Unsplash 월드컵 - 통합 스크립트
// ============================================

console.log('🎮 Unsplash 월드컵 시작...');

// ============================================
// 1. Storage Module
// ============================================

const STORAGE_KEYS = {
  SETTINGS: 'uc:settings',
  LAST_SESSION: 'uc:lastSession',
  HISTORY: 'uc:history',
};

const DEFAULT_SETTINGS = {
  lastCategory: 'dogs', // default animal category
  timeLimitSec: 10,
};

function getSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings) {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    console.log('✅ Settings saved:', updated);
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

function getLastSession() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load session:', error);
  }
  return null;
}

function saveSession(session) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.LAST_SESSION);
    console.log('✅ Session cleared');
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

function getHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
  return [];
}

function addToHistory(entry) {
  try {
    const history = getHistory();
    history.unshift(entry);
    if (history.length > 20) {
      history.splice(20);
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    console.log('✅ Added to history');
  } catch (error) {
    console.error('Failed to add to history:', error);
  }
}

console.log('✅ Storage module loaded');

// ============================================
// 2. Animal Categories Module
// ============================================

const ANIMAL_CATEGORIES = [
  {
    id: 'dogs',
    label: '🐶 강아지',
    emoji: '🐶',
    description: '귀여운 강아지들',
    api: 'dog-ceo',
  },
  {
    id: 'cats',
    label: '🐱 고양이',
    emoji: '🐱',
    description: '사랑스러운 고양이들',
    api: 'cat-api',
  },
  {
    id: 'foxes',
    label: '🦊 여우',
    emoji: '🦊',
    description: '영리한 여우들',
    api: 'random-fox',
  },
  {
    id: 'mix',
    label: '🎲 믹스',
    emoji: '🎲',
    description: '모든 동물 랜덤',
    api: 'mix',
  },
];

function getCategoryInfo(id) {
  return ANIMAL_CATEGORIES.find((cat) => cat.id === id);
}

// Category card image cache to prevent refresh on selection
const categoryImageCache = {};

console.log('✅ Animal categories loaded:', ANIMAL_CATEGORIES.length, 'categories');

// ============================================
// 2-2. Random Selection Phrases
// ============================================

const SELECTION_PHRASES = [
  'Pick me!', 'Choose me!', 'Select me!', 'I\'m the one!', 'Me please!',
  'Pick this!', 'Click here!', 'This one!', 'Right here!', 'Over here!',
  'Yes me!', 'Hey you!', 'Look here!', 'Take me!', 'Want me!',
  'Love me!', 'Need me!', 'Like me!', 'Prefer me!', 'Fancy me!',
  '날 선택해!', '나야 나!', '여기야!', '이쪽!', '나 좋아?',
  '나 골라줘!', '저요!', '접니다!', '여기요!', '택해줘!',
  'Best choice!', 'Good pick!', 'Smart move!', 'Wise choice!', 'Perfect!',
  'Awesome!', 'Amazing!', 'Brilliant!', 'Fantastic!', 'Wonderful!',
  'I win!', 'Top tier!', 'Number one!', 'The best!', 'Supreme!',
  'Elite!', 'Premium!', 'Quality!', 'Superior!', 'Excellent!',
  '최고야!', '1등감!', '완벽해!', '멋져!', '짱이야!',
  'Let\'s go!', 'Here we go!', 'Ready!', 'Set!', 'Go!',
  'Yes yes!', 'Yay!', 'Woohoo!', 'Hooray!', 'Yippee!',
  'Hot pick!', 'Fire!', 'Lit!', 'Dope!', 'Cool!',
  'Sweet!', 'Nice!', 'Great!', 'Super!', 'Mega!',
  '굿!', '오케이!', '좋아!', '그래!', '바로 이거!',
  'Trust me!', 'Believe!', 'Have faith!', 'Count on me!', 'Rely on me!',
  'I\'m here!', 'Present!', 'Ready to go!', 'All set!', 'Prepared!',
  'Winner!', 'Champion!', 'Victor!', 'Hero!', 'Star!',
  'Legend!', 'Icon!', 'Ace!', 'Pro!', 'Boss!',
  '나 예뻐?', '귀엽지?', '멋지지?', '이쁘지?', '잘생겼지?',
];

function getRandomPhrase() {
  return SELECTION_PHRASES[Math.floor(Math.random() * SELECTION_PHRASES.length)];
}

console.log('✅ Random phrases loaded:', SELECTION_PHRASES.length, 'phrases');

// ============================================
// 3. Animal Image API Module
// ============================================

// API Endpoints
const API_ENDPOINTS = {
  'dog-ceo': 'https://dog.ceo/api/breeds/image/random',
  'cat-api': 'https://api.thecatapi.com/v1/images/search',
  'random-fox': 'https://randomfox.ca/floof/',
};

// Fetch single image from specific API
async function fetchSingleAnimalImage(apiType) {
  const endpoint = API_ENDPOINTS[apiType];
  console.log(`🔍 Fetching image from ${apiType}: ${endpoint}`);

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let imageUrl;

    // Parse response based on API type
    switch (apiType) {
      case 'dog-ceo':
        imageUrl = data.message;
        break;
      case 'cat-api':
        imageUrl = data[0].url;
        break;
      case 'random-fox':
        imageUrl = data.image;
        break;
      default:
        throw new Error(`Unknown API type: ${apiType}`);
    }

    console.log(`✅ Got image URL: ${imageUrl}`);

    // Validate image by preloading
    await new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error('Image load timeout'));
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        console.log(`✅ Image preloaded successfully`);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });

    return {
      id: `${apiType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      urlSmall: imageUrl,
      urlFull: imageUrl,
      sourceLink: imageUrl,
      category: apiType,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch from ${apiType}:`, error);
    throw error;
  }
}

// Fetch mixed images: dogs(5), cats(6), foxes(5)
async function fetchMixedAnimalImages(count = 16, onProgress = null) {
  console.log(`📥 Fetching mixed images: dogs(5), cats(6), foxes(5)`);

  const allImages = [];
  let totalLoaded = 0;

  // Define category counts: dogs(5), cats(6), foxes(5)
  const categoryConfig = [
    { api: 'dog-ceo', label: '🐶 강아지', count: 5 },
    { api: 'cat-api', label: '🐱 고양이', count: 6 },
    { api: 'random-fox', label: '🦊 여우', count: 5 },
  ];

  for (const config of categoryConfig) {
    console.log(`\n🔍 Fetching ${config.count} images from ${config.label}`);

    let successCount = 0;
    let attemptCount = 0;
    const MAX_ATTEMPTS = config.count * 5; // 5x retry attempts

    while (successCount < config.count && attemptCount < MAX_ATTEMPTS) {
      attemptCount++;
      try {
        const image = await fetchSingleAnimalImage(config.api);
        allImages.push(image);
        successCount++;
        totalLoaded++;
        console.log(`✨ Added ${config.label} image ${successCount}/${config.count}`);

        if (onProgress) {
          onProgress(totalLoaded, count);
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`⚠️ Failed to fetch ${config.label} image (attempt ${attemptCount}/${MAX_ATTEMPTS})`);
        // Longer delay after failure
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Check if we got enough images from this category
    if (successCount < config.count) {
      console.error(`❌ Failed to load ${config.count} images from ${config.label}, only got ${successCount}`);
    }
  }

  // Check if we have enough total images
  if (allImages.length < count) {
    console.error(`❌ Only loaded ${allImages.length} out of ${count} images`);
    throw new Error(`믹스 카테고리에서 충분한 이미지를 로드하지 못했습니다 (${allImages.length}/${count})`);
  }

  // Shuffle all images using Fisher-Yates algorithm
  console.log(`\n🔀 Shuffling ${allImages.length} mixed images...`);
  for (let i = allImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
  }

  console.log(`✅ Successfully loaded and shuffled ${allImages.length} mixed images!`);
  return allImages;
}

// Fetch multiple images from specific category
async function fetchAnimalImages(category, count = 16, onProgress = null) {
  const categoryInfo = getCategoryInfo(category);
  if (!categoryInfo) {
    throw new Error(`Unknown category: ${category}`);
  }

  // Handle mix category separately
  if (category === 'mix') {
    return await fetchMixedAnimalImages(count, onProgress);
  }

  const apiType = categoryInfo.api;
  console.log(`📥 Fetching ${count} ${categoryInfo.label} images from ${apiType}`);

  const images = [];
  let successCount = 0;
  let failCount = 0;
  const MAX_ATTEMPTS = count * 3; // Allow 3x attempts for failures

  while (images.length < count && (successCount + failCount) < MAX_ATTEMPTS) {
    try {
      const image = await fetchSingleAnimalImage(apiType);
      images.push(image);
      successCount++;
      console.log(`✨ Added image ${images.length}/${count}`);

      if (onProgress) {
        onProgress(images.length, count);
      }

      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      failCount++;
      console.warn(`⚠️ Failed to fetch image (attempt ${successCount + failCount}/${MAX_ATTEMPTS})`);

      // Longer delay after failure
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Progress summary every 5 attempts
    if ((successCount + failCount) % 5 === 0) {
      console.log(`📊 Progress: ${successCount} success, ${failCount} failed, ${images.length}/${count} loaded`);
    }
  }

  console.log(`\n🏁 Final Results:`);
  console.log(`   Successful loads: ${successCount}`);
  console.log(`   Failed loads: ${failCount}`);
  console.log(`   Images collected: ${images.length}/${count}`);

  if (images.length < count) {
    const errorMsg = `Only loaded ${images.length} out of ${count} images`;
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  console.log(`✅ Successfully loaded ${images.length} ${categoryInfo.label} images!`);
  return images;
}

console.log('✅ Animal Image API module loaded');

// ============================================
// 4. Tournament Module
// ============================================

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createMatchPairs(images) {
  const pairs = [];
  for (let i = 0; i < images.length; i += 2) {
    if (i + 1 < images.length) {
      pairs.push({
        left: images[i],
        right: images[i + 1],
      });
    }
  }
  return pairs;
}

function getRoundFromCount(count) {
  switch (count) {
    case 16:
      return 'round16';
    case 8:
      return 'round8';
    case 4:
      return 'round4';
    case 2:
      return 'round2';
    case 1:
      return 'final';
    default:
      return 'round16';
  }
}

function initializeTournament(category, images) {
  console.log(`🏆 Initializing tournament for ${category} with ${images.length} images`);
  const shuffled = shuffleArray(images);
  const pairs = createMatchPairs(shuffled);

  return {
    category,
    round: getRoundFromCount(images.length),
    pairs,
    survivors: [],
    cursor: 0,
    startedAt: Date.now(),
    history: [],
  };
}

function selectWinner(session, winner) {
  console.log(`👆 Selected winner:`, winner.id);
  const newSurvivors = [...session.survivors, winner];
  const newHistory = [...session.history, winner];
  const newCursor = session.cursor + 1;

  if (newCursor >= session.pairs.length) {
    if (newSurvivors.length === 1) {
      console.log('🎉 Tournament complete!');
      return {
        ...session,
        survivors: newSurvivors,
        cursor: newCursor,
        round: 'final',
        history: newHistory,
      };
    }

    const newPairs = createMatchPairs(newSurvivors);
    console.log(`📊 Moving to next round: ${getRoundFromCount(newSurvivors.length)}`);
    return {
      ...session,
      round: getRoundFromCount(newSurvivors.length),
      pairs: newPairs,
      survivors: [],
      cursor: 0,
      history: newHistory,
    };
  }

  return {
    ...session,
    survivors: newSurvivors,
    cursor: newCursor,
    history: newHistory,
  };
}

function getCurrentMatch(session) {
  if (session.cursor < session.pairs.length) {
    return session.pairs[session.cursor];
  }
  return null;
}

function getRoundInfo(session) {
  const roundNames = {
    round16: '16강',
    round8: '8강',
    round4: '4강',
    round2: '결승',
    final: '우승',
  };

  return {
    name: roundNames[session.round] || '진행중',
    matchNumber: session.cursor + 1,
    totalMatches: session.pairs.length,
  };
}

function autoSelectWinner(session) {
  const currentMatch = getCurrentMatch(session);
  if (!currentMatch) {
    return session;
  }

  const randomWinner = Math.random() < 0.5 ? currentMatch.left : currentMatch.right;
  console.log('⏰ Time out! Auto-selected:', randomWinner.id);
  return selectWinner(session, randomWinner);
}

console.log('✅ Tournament module loaded');

// ============================================
// 5. UI Helper Functions
// ============================================

function createElement(tag, className = '', content = '') {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (content) {
    if (typeof content === 'string') {
      element.textContent = content;
    } else {
      element.appendChild(content);
    }
  }
  return element;
}

function createButton(text, className = '', onClick = null) {
  const button = createElement('button', `pixel-button ${className}`, text);
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

function createBadge(text, color = 'secondary') {
  return createElement('span', `pixel-badge pixel-badge--${color}`, text);
}

function createProgressBar(value, max = 100, showPercentage = false, color = 'accent') {
  const percentage = Math.min(100, (value / max) * 100);
  const container = createElement('div', 'pixel-progress');
  const bar = createElement('div', `pixel-progress-bar pixel-progress-bar--${color}`);
  bar.style.width = `${percentage}%`;
  container.appendChild(bar);

  if (showPercentage) {
    const text = createElement('div', 'pixel-progress-text', `${Math.round(percentage)}%`);
    container.appendChild(text);
  }

  return container;
}

function updateProgressBar(progressBar, value, max = 100) {
  const percentage = Math.min(100, (value / max) * 100);
  const bar = progressBar.querySelector('.pixel-progress-bar');
  if (bar) {
    bar.style.width = `${percentage}%`;
  }
  const text = progressBar.querySelector('.pixel-progress-text');
  if (text) {
    text.textContent = `${Math.round(percentage)}%`;
  }
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createFooter() {
  const footer = createElement('footer', 'app-footer');
  const text = createElement('p', 'footer-text', 'Copyright © 2025 by KwonYoungHu @Kookmin University');
  footer.appendChild(text);
  return footer;
}

function createCard(clickable = false) {
  const className = clickable ? 'pixel-card pixel-card--clickable' : 'pixel-card';
  return createElement('div', className);
}

function createImage(src, alt = '', className = 'pixel-art') {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.className = className;
  return img;
}

console.log('✅ UI module loaded');

// ============================================
// 6. Main App Logic
// ============================================

let currentScreen = 'home';
let selectedCategory = null;
let session = null;
let gameTimer = null;
let timeLeft = 10;

let app = null;

function init() {
  console.log('🚀 Initializing app...');
  app = document.getElementById('app');

  if (!app) {
    console.error('❌ App element not found!');
    return;
  }

  console.log('✅ App element found');
  renderScreen('home');
}

function renderScreen(screen) {
  console.log(`🖼️ Rendering screen: ${screen}`);
  currentScreen = screen;
  clearElement(app);

  switch (screen) {
    case 'home':
      renderHomeScreen();
      break;
    case 'loading':
      renderLoadingScreen();
      break;
    case 'game':
      renderGameScreen();
      break;
    case 'result':
      renderResultScreen();
      break;
  }
}

// Home Screen
function renderHomeScreen() {
  console.log('🏠 Rendering home screen');
  const container = createElement('div', 'home-screen');

  const title = createElement('h1', 'home-title', '동물 월드컵');
  const subtitle = createElement('p', 'home-subtitle', '귀여운 동물들의 토너먼트');
  container.appendChild(title);
  container.appendChild(subtitle);

  const history = getHistory();
  if (history.length > 0) {
    const badge = createBadge(`플레이 횟수: ${history.length}`, 'info');
    badge.style.marginBottom = 'var(--spacing-xl)';
    container.appendChild(badge);
  }

  // 동물 카테고리 선택
  const categorySection = createElement('div', 'category-selection');
  categorySection.style.marginTop = 'var(--spacing-xl)';
  categorySection.style.marginBottom = 'var(--spacing-lg)';

  const categoryTitle = createElement('h3', 'category-title', '동물 선택');
  categorySection.appendChild(categoryTitle);

  const categoryGrid = createElement('div', 'category-grid');
  categoryGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  categoryGrid.style.maxWidth = '1000px';

  const settings = getSettings();
  const currentCategory = settings.lastCategory || 'dogs';

  // 각 동물 카테고리 카드 생성
  ANIMAL_CATEGORIES.forEach(category => {
    const card = createElement('div', 'category-card pixel-card pixel-card--clickable');
    if (currentCategory === category.id) {
      card.classList.add('category-card--selected');
    }

    // 이미지 래퍼 생성
    const imageWrapper = createElement('div', 'category-card-image-wrapper');

    // 카테고리별 대표 이미지 로드 (캐시 사용)
    if (category.id === 'mix') {
      // 믹스 카테고리는 큰 물음표 텍스트 표시
      const placeholder = createElement('div', 'category-card-placeholder', '?');
      imageWrapper.appendChild(placeholder);
    } else {
      // 캐시에서 이미지 확인
      if (categoryImageCache[category.id]) {
        const img = createImage(categoryImageCache[category.id], category.label, 'category-card-image');
        imageWrapper.appendChild(img);
      } else {
        // 캐시에 없으면 API에서 로드하고 캐시에 저장
        fetchSingleAnimalImage(category.api).then(image => {
          categoryImageCache[category.id] = image.urlSmall;
          const img = createImage(image.urlSmall, category.label, 'category-card-image');
          imageWrapper.appendChild(img);
        }).catch(err => {
          console.log(`Failed to load image for ${category.label}:`, err);
        });
      }
    }

    card.appendChild(imageWrapper);

    // 텍스트 컨테이너 생성
    const textContainer = createElement('div', 'category-card-text');
    const label = createElement('div', 'category-label', category.label);
    const description = createElement('div', 'category-keywords', category.description);
    textContainer.appendChild(label);
    textContainer.appendChild(description);
    card.appendChild(textContainer);

    card.addEventListener('click', () => {
      saveSettings({ lastCategory: category.id });
      renderScreen('home'); // 화면 갱신
    });

    categoryGrid.appendChild(card);
  });

  categorySection.appendChild(categoryGrid);
  container.appendChild(categorySection);

  const actionsDiv = createElement('div', 'home-actions');
  actionsDiv.style.marginTop = 'var(--spacing-xl)';

  const startButton = createButton('시작하기', 'pixel-button--accent pixel-button--large', () => {
    console.log('🎬 Starting game with category:', currentCategory);
    renderScreen('loading');
  });
  actionsDiv.appendChild(startButton);
  container.appendChild(actionsDiv);

  const infoDiv = createElement('div', 'home-info');
  const info1 = createElement('p', 'info-text', '16장의 이미지로 16강 토너먼트를 진행합니다');
  const info2 = createElement('p', 'info-text', '각 라운드마다 10초의 제한시간이 있습니다');
  const info3 = createElement('p', 'info-text', '키보드 ← / → 또는 클릭으로 선택하세요');
  infoDiv.appendChild(info1);
  infoDiv.appendChild(info2);
  infoDiv.appendChild(info3);
  container.appendChild(infoDiv);

  // Footer
  container.appendChild(createFooter());

  app.appendChild(container);
  console.log('✅ Home screen rendered with category:', currentCategory);
}

// Loading Screen
async function renderLoadingScreen() {
  console.log('⏳ Rendering loading screen');
  const container = createElement('div', 'loading-screen');
  const content = createElement('div', 'loading-content');

  const title = createElement('h2', 'loading-title pixel-blink', '이미지 로딩 중...');
  content.appendChild(title);

  const progressDiv = createElement('div', 'loading-progress');
  const progressBar = createProgressBar(0, 16, true);
  const progressText = createElement('p', 'loading-text', '0 / 16 이미지');
  progressDiv.appendChild(progressBar);
  progressDiv.appendChild(progressText);
  content.appendChild(progressDiv);

  // 선택된 카테고리 확인 (스피너 이미지를 위해 먼저 확인)
  const settings = getSettings();
  const category = settings.lastCategory || 'dogs';
  const categoryInfo = getCategoryInfo(category);

  const spinner = createElement('div', 'loading-spinner');
  const spinnerInner = createElement('div', 'pixel-spinner');

  // 카테고리별 대표 이미지 추가
  if (category !== 'mix') {
    // 미리 로드할 대표 이미지를 가져오기
    fetchSingleAnimalImage(categoryInfo.api).then(image => {
      const spinnerImg = createImage(image.urlSmall, 'Loading', 'spinner-image');
      spinner.appendChild(spinnerImg);
    }).catch(err => {
      console.log('Failed to load spinner image:', err);
    });
  } else {
    // 믹스 카테고리는 이모지 표시
    const mixEmoji = createElement('div', 'spinner-emoji');
    mixEmoji.textContent = '🎲';
    mixEmoji.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 48px;
    `;
    spinner.appendChild(mixEmoji);
  }

  spinner.appendChild(spinnerInner);
  content.appendChild(spinner);

  const cancelButton = createButton('취소', 'pixel-button--secondary pixel-button--small', () => {
    renderScreen('home');
  });
  content.appendChild(cancelButton);

  container.appendChild(content);

  // Footer
  container.appendChild(createFooter());

  app.appendChild(container);

  try {
    console.log(`📸 Loading ${categoryInfo.label} images`);

    const images = await fetchAnimalImages(category, 16, (loaded, total) => {
      updateProgressBar(progressBar, loaded, total);
      progressText.textContent = `${loaded} / ${total} 이미지`;
    });

    session = initializeTournament(category, images);

    setTimeout(() => {
      renderScreen('game');
    }, 500);
  } catch (error) {
    console.error('❌ Failed to load images:', error);

    clearElement(content);
    const errorDiv = createElement('div', 'loading-error');
    const errorText = createElement('p', 'error-text', `오류 발생: ${error.message}`);
    errorDiv.appendChild(errorText);

    const errorActions = createElement('div', 'error-actions');
    const retryButton = createButton('재시도', 'pixel-button--primary', () => {
      renderScreen('loading');
    });
    const backButton = createButton('돌아가기', 'pixel-button--secondary', () => {
      renderScreen('home');
    });
    errorActions.appendChild(retryButton);
    errorActions.appendChild(backButton);
    errorDiv.appendChild(errorActions);

    content.appendChild(errorDiv);
  }
}

// Game Screen
function renderGameScreen() {
  console.log('🎮 Rendering game screen');
  if (!session) {
    console.error('❌ No session found!');
    return;
  }

  const container = createElement('div', 'game-screen');

  const roundInfo = getRoundInfo(session);
  const header = createElement('div', 'game-header');

  // 라운드 정보 컨테이너
  const roundInfoDiv = createElement('div', 'game-round-info');
  const roundBadge = createBadge(roundInfo.name, 'accent');
  roundBadge.style.fontSize = 'var(--font-size-lg)';
  roundBadge.style.padding = 'var(--spacing-sm) var(--spacing-lg)';
  roundInfoDiv.appendChild(roundBadge);

  // 진행 상황
  const progressText = createElement('div', 'game-progress-text', `${roundInfo.matchNumber} / ${roundInfo.totalMatches} 경기`);

  header.appendChild(roundInfoDiv);
  header.appendChild(progressText);
  container.appendChild(header);

  const timerDiv = createElement('div', 'game-timer');
  const timerBar = createProgressBar(timeLeft, 10, false, timeLeft <= 3 ? 'warning' : 'success');
  timerDiv.appendChild(timerBar);
  container.appendChild(timerDiv);

  const currentMatch = getCurrentMatch(session);
  if (!currentMatch) {
    console.log('No more matches, showing result');
    renderScreen('result');
    return;
  }

  console.log('Current match:', currentMatch.left.id, 'vs', currentMatch.right.id);

  const matchDiv = createElement('div', 'game-match');

  const leftCard = createGameCard(currentMatch.left, 'left');
  matchDiv.appendChild(leftCard);

  const vs = createElement('div', 'game-vs pixel-bounce', 'VS');
  matchDiv.appendChild(vs);

  const rightCard = createGameCard(currentMatch.right, 'right');
  matchDiv.appendChild(rightCard);

  container.appendChild(matchDiv);

  const hint = createElement('div', 'game-hint', '키보드 ← / → 또는 클릭으로 선택하세요');
  container.appendChild(hint);

  // Footer
  container.appendChild(createFooter());

  app.appendChild(container);

  startTimer(timerBar);
  setupKeyboardControls(currentMatch);
  console.log('✅ Game screen rendered');
}

function createGameCard(image, side) {
  const card = createElement('div', 'game-card');

  const img = createImage(image.urlSmall, side === 'left' ? 'Left choice' : 'Right choice', 'game-image');
  card.appendChild(img);

  const overlay = createElement('div', 'game-card-overlay');
  const hint = createElement('div', 'game-card-hint', side === 'left' ? '←' : '→');
  overlay.appendChild(hint);
  card.appendChild(overlay);

  const credit = createElement('div', 'game-card-credit', getRandomPhrase());
  card.appendChild(credit);

  card.addEventListener('click', () => handleCardSelect(image, side, card));

  return card;
}

function handleCardSelect(winner, side, card) {
  if (!session) return;

  stopTimer();

  card.classList.add('game-card--selected');
  document.querySelectorAll('.game-card').forEach((c) => {
    if (c !== card) {
      c.classList.add('game-card--rejected');
    }
  });

  session = selectWinner(session, winner);
  saveSession(session);

  setTimeout(() => {
    if (session.round === 'final' && session.cursor >= session.pairs.length) {
      renderScreen('result');
    } else {
      renderScreen('game');
    }
  }, 600);
}

function startTimer(timerBar) {
  timeLeft = 10;
  stopTimer();

  gameTimer = setInterval(() => {
    timeLeft--;
    updateProgressBar(timerBar, timeLeft, 10);

    const bar = timerBar.querySelector('.pixel-progress-bar');
    if (bar) {
      bar.className = `pixel-progress-bar pixel-progress-bar--${timeLeft <= 3 ? 'warning' : 'success'}`;
    }

    if (timeLeft <= 0) {
      stopTimer();
      session = autoSelectWinner(session);
      saveSession(session);
      setTimeout(() => {
        renderScreen('game');
      }, 300);
    }
  }, 1000);
}

function stopTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

function setupKeyboardControls(currentMatch) {
  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
      const leftCard = document.querySelector('.game-card:first-child');
      if (leftCard) {
        handleCardSelect(currentMatch.left, 'left', leftCard);
        window.removeEventListener('keydown', handleKeyPress);
      }
    } else if (e.key === 'ArrowRight') {
      const rightCard = document.querySelector('.game-card:last-child');
      if (rightCard) {
        handleCardSelect(currentMatch.right, 'right', rightCard);
        window.removeEventListener('keydown', handleKeyPress);
      }
    }
  };

  window.addEventListener('keydown', handleKeyPress);
}

// Result Screen
function renderResultScreen() {
  console.log('🏆 Rendering result screen');
  if (!session) return;

  const container = createElement('div', 'result-screen');

  const title = createElement('h1', 'result-title pixel-bounce', '🏆 우승 🏆');
  container.appendChild(title);

  // Removed category badge since we're using random images

  const winner = session.survivors[0];
  if (winner) {
    const winnerDiv = createElement('div', 'result-winner');
    const winnerCard = createElement('div', 'winner-card');

    const img = createImage(winner.urlSmall, 'Winner', 'winner-image');
    winnerCard.appendChild(img);

    const credit = createElement('div', 'winner-credit', "Best Of Best!");
    winnerCard.appendChild(credit);

    winnerDiv.appendChild(winnerCard);
    container.appendChild(winnerDiv);

    const topN = session.history.slice(-8).reverse();
    addToHistory({
      date: Date.now(),
      category: 'random',
      winnerUrl: winner.urlSmall,
      topN: topN,
    });
  }

  const actionsDiv = createElement('div', 'result-actions');

  const downloadButton = createButton('다운로드', 'pixel-button--primary pixel-button--large', async () => {
    if (winner) {
      try {
        const response = await fetch(winner.urlFull);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `unsplash-winner-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log('✅ Download started');
      } catch (error) {
        console.error('❌ Download failed:', error);
        alert('다운로드에 실패했습니다');
      }
    }
  });

  const restartButton = createButton('다시 하기', 'pixel-button--accent pixel-button--large', () => {
    clearSession();
    renderScreen('loading');
  });

  const newCategoryButton = createButton('다른 카테고리', 'pixel-button--secondary pixel-button--large', () => {
    clearSession();
    selectedCategory = null;
    session = null;
    renderScreen('home');
  });

  actionsDiv.appendChild(downloadButton);
  actionsDiv.appendChild(restartButton);
  actionsDiv.appendChild(newCategoryButton);
  container.appendChild(actionsDiv);

  const topN = session.history.slice(-8).reverse();
  if (topN.length > 1) {
    const rankingDiv = createElement('div', 'result-ranking');
    const rankingTitle = createElement('h3', 'ranking-title', 'Top 8');
    rankingDiv.appendChild(rankingTitle);

    const rankingGrid = createElement('div', 'ranking-grid');
    topN.forEach((image, index) => {
      const item = createElement('div', 'ranking-item');
      const badge = createElement('div', 'ranking-badge', `${index + 1}`);
      const img = createImage(image.urlSmall, `Rank ${index + 1}`, 'ranking-image');
      item.appendChild(badge);
      item.appendChild(img);
      rankingGrid.appendChild(item);
    });

    rankingDiv.appendChild(rankingGrid);
    container.appendChild(rankingDiv);
  }

  // Footer
  container.appendChild(createFooter());

  clearSession();
  app.appendChild(container);
  console.log('✅ Result screen rendered');
}

// ============================================
// Start App
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('✅ Main script loaded');
