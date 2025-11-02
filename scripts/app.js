// 메인 앱 로직

import { CATEGORIES, getCategoryInfo } from './categories.js';
import { fetchImagesForCategory } from './unsplash.js';
import {
  initializeTournament,
  selectWinner,
  getCurrentMatch,
  getRoundInfo,
  autoSelectWinner,
} from './tournament.js';
import {
  getSettings,
  saveSettings,
  getHistory,
  addToHistory,
  clearSession,
  saveSession,
} from './storage.js';
import {
  createElement,
  createButton,
  createBadge,
  createProgressBar,
  updateProgressBar,
  clearElement,
  createCard,
  createImage,
} from './ui.js';

// 앱 상태
let currentScreen = 'home';
let selectedCategory = null;
let session = null;
let gameTimer = null;
let timeLeft = 10;

// DOM 요소
const app = document.getElementById('app');

// 초기화
function init() {
  renderScreen('home');
}

// 화면 렌더링
function renderScreen(screen) {
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

// 홈 화면
function renderHomeScreen() {
  const container = createElement('div', 'home-screen');

  // Header
  const title = createElement('h1', 'home-title', 'Unsplash 월드컵');
  const subtitle = createElement('p', 'home-subtitle', '이미지 토너먼트 게임');
  container.appendChild(title);
  container.appendChild(subtitle);

  // 플레이 횟수
  const history = getHistory();
  if (history.length > 0) {
    const badge = createBadge(`플레이 횟수: ${history.length}`, 'info');
    container.appendChild(badge);
  }

  // 카테고리 선택
  const categoryTitle = createElement('h2', 'category-title', '카테고리 선택');
  container.appendChild(categoryTitle);

  const categoryGrid = createElement('div', 'category-grid');

  CATEGORIES.forEach((category) => {
    const card = createCard(true);
    card.addEventListener('click', () => {
      document.querySelectorAll('.category-card').forEach((c) => {
        c.classList.remove('category-card--selected');
      });
      card.classList.add('category-card--selected');
      selectedCategory = category.id;
    });

    const label = createElement('div', 'category-label', category.label);
    const keywords = createElement('div', 'category-keywords', category.keywords.slice(0, 2).join(', '));

    card.appendChild(label);
    card.appendChild(keywords);
    card.classList.add('category-card');
    categoryGrid.appendChild(card);

    // 마지막 선택 카테고리 하이라이트
    const settings = getSettings();
    if (settings.lastCategory === category.id) {
      selectedCategory = category.id;
      card.classList.add('category-card--selected');
    }
  });

  container.appendChild(categoryGrid);

  // 시작 버튼
  const actionsDiv = createElement('div', 'home-actions');
  const startButton = createButton('시작하기', 'pixel-button--accent pixel-button--large', () => {
    if (selectedCategory) {
      saveSettings({ lastCategory: selectedCategory });
      renderScreen('loading');
    }
  });
  actionsDiv.appendChild(startButton);
  container.appendChild(actionsDiv);

  // 안내
  const infoDiv = createElement('div', 'home-info');
  const info1 = createElement('p', 'info-text', '32장의 이미지를 1:1 토너먼트로 진행합니다');
  const info2 = createElement('p', 'info-text', '각 라운드마다 10초의 제한시간이 있습니다');
  const info3 = createElement('p', 'info-text', '키보드 ← / → 또는 클릭으로 선택하세요');
  infoDiv.appendChild(info1);
  infoDiv.appendChild(info2);
  infoDiv.appendChild(info3);
  container.appendChild(infoDiv);

  app.appendChild(container);
}

// 로딩 화면
async function renderLoadingScreen() {
  const container = createElement('div', 'loading-screen');
  const content = createElement('div', 'loading-content');

  const title = createElement('h2', 'loading-title pixel-blink', '이미지 로딩 중...');
  content.appendChild(title);

  const progressDiv = createElement('div', 'loading-progress');
  const progressBar = createProgressBar(0, 32, true);
  const progressText = createElement('p', 'loading-text', '0 / 32 이미지');
  progressDiv.appendChild(progressBar);
  progressDiv.appendChild(progressText);
  content.appendChild(progressDiv);

  const spinner = createElement('div', 'loading-spinner');
  const spinnerInner = createElement('div', 'pixel-spinner');
  spinner.appendChild(spinnerInner);
  content.appendChild(spinner);

  const cancelButton = createButton('취소', 'pixel-button--secondary pixel-button--small', () => {
    renderScreen('home');
  });
  content.appendChild(cancelButton);

  container.appendChild(content);
  app.appendChild(container);

  // 이미지 로딩
  try {
    const images = await fetchImagesForCategory(selectedCategory, 32, (loaded, total) => {
      updateProgressBar(progressBar, loaded, total);
      progressText.textContent = `${loaded} / ${total} 이미지`;
    });

    // 토너먼트 초기화
    session = initializeTournament(selectedCategory, images);

    setTimeout(() => {
      renderScreen('game');
    }, 500);
  } catch (error) {
    console.error('Failed to load images:', error);

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

// 게임 화면
function renderGameScreen() {
  if (!session) return;

  const container = createElement('div', 'game-screen');

  // Header
  const roundInfo = getRoundInfo(session);
  const header = createElement('div', 'game-header');
  const roundBadge = createBadge(roundInfo.name, 'accent');
  const progressText = createElement('div', 'game-progress-text', `${roundInfo.matchNumber} / ${roundInfo.totalMatches}`);
  header.appendChild(roundBadge);
  header.appendChild(progressText);
  container.appendChild(header);

  // Timer
  const timerDiv = createElement('div', 'game-timer');
  const timerBar = createProgressBar(timeLeft, 10, false, timeLeft <= 3 ? 'warning' : 'success');
  timerDiv.appendChild(timerBar);
  container.appendChild(timerDiv);

  // Match
  const currentMatch = getCurrentMatch(session);
  if (!currentMatch) {
    renderScreen('result');
    return;
  }

  const matchDiv = createElement('div', 'game-match');

  // Left card
  const leftCard = createGameCard(currentMatch.left, 'left');
  matchDiv.appendChild(leftCard);

  // VS
  const vs = createElement('div', 'game-vs pixel-bounce', 'VS');
  matchDiv.appendChild(vs);

  // Right card
  const rightCard = createGameCard(currentMatch.right, 'right');
  matchDiv.appendChild(rightCard);

  container.appendChild(matchDiv);

  // Hint
  const hint = createElement('div', 'game-hint', '키보드 ← / → 또는 클릭으로 선택하세요');
  container.appendChild(hint);

  app.appendChild(container);

  // 타이머 시작
  startTimer(timerBar);

  // 키보드 이벤트
  setupKeyboardControls(currentMatch);
}

function createGameCard(image, side) {
  const card = createElement('div', 'game-card');

  const img = createImage(image.urlSmall, side === 'left' ? 'Left choice' : 'Right choice', 'game-image');
  card.appendChild(img);

  const overlay = createElement('div', 'game-card-overlay');
  const hint = createElement('div', 'game-card-hint', side === 'left' ? '←' : '→');
  overlay.appendChild(hint);
  card.appendChild(overlay);

  if (image.authorName) {
    const credit = createElement('div', 'game-card-credit', `Photo by ${image.authorName}`);
    card.appendChild(credit);
  }

  card.addEventListener('click', () => handleCardSelect(image, side, card));

  return card;
}

function handleCardSelect(winner, side, card) {
  if (!session) return;

  stopTimer();

  // 애니메이션
  card.classList.add('game-card--selected');
  const otherSide = side === 'left' ? 'right' : 'left';
  document.querySelectorAll('.game-card').forEach((c) => {
    if (c !== card) {
      c.classList.add('game-card--rejected');
    }
  });

  // 다음 라운드로
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

    // 색상 변경
    const bar = timerBar.querySelector('.pixel-progress-bar');
    if (bar) {
      bar.className = `pixel-progress-bar pixel-progress-bar--${timeLeft <= 3 ? 'warning' : 'success'}`;
    }

    if (timeLeft <= 0) {
      stopTimer();
      // 자동 선택
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
      handleCardSelect(currentMatch.left, 'left', leftCard);
      window.removeEventListener('keydown', handleKeyPress);
    } else if (e.key === 'ArrowRight') {
      const rightCard = document.querySelector('.game-card:last-child');
      handleCardSelect(currentMatch.right, 'right', rightCard);
      window.removeEventListener('keydown', handleKeyPress);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
}

// 결과 화면
function renderResultScreen() {
  if (!session) return;

  const container = createElement('div', 'result-screen');

  // Title
  const title = createElement('h1', 'result-title pixel-bounce', '🏆 우승 🏆');
  container.appendChild(title);

  const categoryInfo = getCategoryInfo(session.category);
  if (categoryInfo) {
    const badge = createBadge(categoryInfo.label, 'accent');
    badge.style.display = 'block';
    badge.style.textAlign = 'center';
    badge.style.marginBottom = 'var(--spacing-lg)';
    container.appendChild(badge);
  }

  // Winner
  const winner = session.survivors[0];
  if (winner) {
    const winnerDiv = createElement('div', 'result-winner');
    const winnerCard = createElement('div', 'winner-card');

    const img = createImage(winner.urlSmall, 'Winner', 'winner-image');
    winnerCard.appendChild(img);

    if (winner.authorName) {
      const credit = createElement('div', 'winner-credit');
      credit.innerHTML = `Photo by ${winner.authorName} on <a href="https://unsplash.com" target="_blank">Unsplash</a>`;
      winnerCard.appendChild(credit);
    }

    winnerDiv.appendChild(winnerCard);
    container.appendChild(winnerDiv);

    // 히스토리에 저장
    const topN = session.history.slice(-8).reverse();
    addToHistory({
      date: Date.now(),
      category: session.category,
      winnerUrl: winner.urlSmall,
      topN: topN,
    });
  }

  // Actions
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
      } catch (error) {
        console.error('Download failed:', error);
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

  // Top 8 ranking
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

  clearSession();
  app.appendChild(container);
}

// 앱 시작
document.addEventListener('DOMContentLoaded', init);
