/**
 * open-stage.js - Pack Selection and Opening Stage
 * Handles pack selection UI and drag-to-tear interaction
 */

import { getPacksData } from './packs.js';
import { setState } from './main.js';
import { playSound } from './sound.js';

/**
 * Render pack selection screen
 */
export function renderPackSelection() {
  const app = document.getElementById('app');
  const packsData = getPacksData();

  const html = `
    <div class="pack-selection">
      <h2>Choose Your Pack</h2>
      <p class="subtitle">Each pack contains 10 mystical cards from across all realms</p>

      <div class="pack-grid">
        ${packsData.map(pack => `
          <div class="pack-card" data-pack-id="${pack.id}">
            <div class="pack-image-container">
              <img src="${pack.image}" alt="${pack.name}" loading="lazy">
              <div class="pack-glow"></div>
            </div>
            <h3>${pack.name}</h3>
            <p class="pack-description">${pack.description}</p>
            <div class="pack-stats">
              <span class="pack-stat">10 Cards</span>
              <span class="pack-stat">All Types</span>
            </div>
            <button class="select-btn">Open Pack</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Event listeners
  document.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const packId = e.target.closest('.pack-card').dataset.packId;
      const pack = getPacksData().find(p => p.id === packId);

      if (pack) {
        setState('tearing', { pack });
      }
    });
  });
}

/**
 * Render tearing stage with drag interaction
 * @param {Object} pack - Pack data object
 */
export function renderTearingStage(pack) {
  const app = document.getElementById('app');

  const html = `
    <div class="tearing-stage">
      <h2 class="stage-title">Drag to Open</h2>

      <div class="pack-wrapper">
        <div class="pack-overlay" id="packOverlay">
          <img src="${pack.image}" alt="${pack.name}">

          <div class="tear-progress">
            <span id="progressText">Drag right to tear →</span>
            <div class="progress-bar-tear">
              <div id="tearProgress" class="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="hint">
        <p>=I Drag the pack to the right to open it!</p>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Initialize drag interaction
  initDragToTear(pack);
}

/**
 * Initialize drag-to-tear interaction
 * @param {Object} pack - Pack data object
 */
function initDragToTear(pack) {
  const overlay = document.getElementById('packOverlay');
  const progressFill = document.getElementById('tearProgress');
  const progressText = document.getElementById('progressText');

  let isDragging = false;
  let startX = 0;
  let currentProgress = 0;
  const dragDistance = 300; // 300px를 드래그하면 100% 달성

  overlay.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    overlay.style.cursor = 'grabbing';
    overlay.classList.add('dragging');
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    // 300px 기준으로 진행도 계산 (더 직관적)
    currentProgress = Math.min(Math.max(deltaX / dragDistance, 0), 1);

    // Update UI
    progressFill.style.width = (currentProgress * 100) + '%';
    progressText.textContent = Math.floor(currentProgress * 100) + '%';

    // 팩이 마우스를 따라가는 느낌 + 찢어지는 효과
    const moveAmount = deltaX * 0.5; // 마우스 이동의 50%만큼 팩도 이동
    overlay.style.transform = `translateX(${moveAmount}px) rotate(${currentProgress * 5}deg)`;

    // 찢어지는 효과 (좌측에서 우측으로)
    overlay.style.clipPath = `polygon(${currentProgress * 100}% 0, 100% 0, 100% 100%, ${currentProgress * 100}% 100%)`;
    overlay.style.opacity = 1 - (currentProgress * 0.2);

    // Threshold reached
    if (currentProgress >= 1) {
      completeTearing(pack);
      isDragging = false;
    }
  });

  window.addEventListener('pointerup', () => {
    if (isDragging && currentProgress < 1) {
      // Snap back animation if not complete
      if (typeof gsap !== 'undefined') {
        gsap.to(overlay, {
          transform: 'translateX(0px) rotate(0deg)',
          clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)',
          opacity: 1,
          duration: 0.4,
          ease: 'back.out',
          onComplete: () => {
            currentProgress = 0;
            progressFill.style.width = '0%';
            progressText.textContent = 'Drag right to tear →';
          }
        });
      } else {
        // Fallback without GSAP
        overlay.style.transform = 'translateX(0px) rotate(0deg)';
        overlay.style.clipPath = 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)';
        overlay.style.opacity = '1';
        currentProgress = 0;
        progressFill.style.width = '0%';
        progressText.textContent = 'Drag right to tear →';
      }
    }

    isDragging = false;
    overlay.style.cursor = 'grab';
    overlay.classList.remove('dragging');
  });
}

/**
 * Complete tearing animation and transition to reveal grid
 * @param {Object} pack - Pack data object
 */
function completeTearing(pack) {
  const overlay = document.getElementById('packOverlay');

  // Add explosion effect
  overlay.classList.add('explode');

  // Play pack tear sound
  playSound('packTear');

  // Animate out with GSAP if available
  if (typeof gsap !== 'undefined') {
    gsap.to(overlay, {
      opacity: 0,
      scale: 1.2,
      rotation: 5,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        setState('revealingGrid', { pack });
      }
    });
  } else {
    // Fallback animation
    overlay.style.transition = 'all 0.8s ease-out';
    overlay.style.opacity = '0';
    overlay.style.transform = 'scale(1.2) rotate(5deg)';

    setTimeout(() => {
      setState('revealingGrid', { pack });
    }, 800);
  }
}
