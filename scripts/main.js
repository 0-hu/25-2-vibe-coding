/**
 * main.js - Application State Machine & Core Logic
 * Manages app states and orchestrates different views
 */

import { loadData, draw10Cards } from './packs.js';
import { renderPackSelection, renderTearingStage } from './open-stage.js';
import { renderRevealGrid } from './reveal.js';
import { loadInventory, saveToInventory } from './inventory.js';
import { toggleSound, isSoundEnabled } from './sound.js';

// Application state
let currentState = 'idle';
let currentPack = null;
let drawnCards = [];
let pityCounter = {
  pullsSinceLastEpic: 0,
  pullsSinceLastMythic: 0,
  totalPulls: 0
};

/**
 * Change application state and render appropriate view
 * @param {string} newState - New state name
 * @param {Object} data - Additional data for the new state
 */
export function setState(newState, data = {}) {
  console.log(`State transition: ${currentState} ’ ${newState}`);
  currentState = newState;

  switch (newState) {
    case 'selectingPack':
      renderPackSelection();
      break;

    case 'tearing':
      currentPack = data.pack;
      renderTearingStage(data.pack);
      break;

    case 'revealingGrid':
      // Draw 10 cards with pity system
      drawnCards = draw10Cards(data.pack.id, pityCounter);
      savePityCounter();
      renderRevealGrid(drawnCards);
      updatePityUI();
      break;

    case 'summary':
      renderSummary(data.cards || drawnCards);
      break;

    case 'inventory':
      renderInventoryView();
      break;

    default:
      console.warn(`Unknown state: ${newState}`);
  }
}

/**
 * Update Pity Counter UI
 */
export function updatePityUI() {
  document.getElementById('totalPulls').textContent = pityCounter.totalPulls;

  const epicRemaining = 30 - pityCounter.pullsSinceLastEpic;
  const mythicRemaining = 90 - pityCounter.pullsSinceLastMythic;

  document.getElementById('epicCounter').textContent = epicRemaining;
  document.getElementById('mythicCounter').textContent = mythicRemaining;

  // Update progress bars
  const epicProgress = (pityCounter.pullsSinceLastEpic / 30) * 100;
  const mythicProgress = (pityCounter.pullsSinceLastMythic / 90) * 100;

  const epicBar = document.getElementById('epicProgress');
  const mythicBar = document.getElementById('mythicProgress');

  epicBar.style.width = epicProgress + '%';
  mythicBar.style.width = mythicProgress + '%';

  // Add warning class if close to pity
  if (pityCounter.pullsSinceLastEpic >= 27) {
    epicBar.classList.add('warning');
  } else {
    epicBar.classList.remove('warning');
  }

  if (pityCounter.pullsSinceLastMythic >= 81) {
    mythicBar.classList.add('warning');
  } else {
    mythicBar.classList.remove('warning');
  }
}

/**
 * Render summary panel after all cards revealed
 * @param {Array} cards - Array of revealed cards
 */
function renderSummary(cards) {
  const app = document.getElementById('app');

  // Calculate stats
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
        <button id="toInventoryBtn" class="primary-btn">=æ View Inventory</button>
        <button id="openAnotherBtn" class="secondary-btn"><´ Open Another Pack</button>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Save cards to inventory
  saveToInventory(cards);

  // Event listeners
  document.getElementById('toInventoryBtn').addEventListener('click', () => {
    setState('inventory');
  });

  document.getElementById('openAnotherBtn').addEventListener('click', () => {
    setState('selectingPack');
  });
}

/**
 * Render inventory view
 */
function renderInventoryView() {
  const app = document.getElementById('app');
  const inventory = loadInventory();

  if (inventory.length === 0) {
    app.innerHTML = `
      <div class="empty-inventory text-center">
        <h2>No Cards Yet</h2>
        <p>Open a pack to start your collection!</p>
        <button id="backToPacksBtn" class="primary-btn">Open Pack</button>
      </div>
    `;

    document.getElementById('backToPacksBtn').addEventListener('click', () => {
      setState('selectingPack');
    });
    return;
  }

  // Import and render full inventory UI
  import('./inventory.js').then(module => {
    module.renderInventory();
  });
}

/**
 * Save pity counter to localStorage
 */
function savePityCounter() {
  localStorage.setItem('pityCounter', JSON.stringify(pityCounter));
}

/**
 * Load pity counter from localStorage
 */
function loadPityCounter() {
  const saved = localStorage.getItem('pityCounter');
  if (saved) {
    pityCounter = JSON.parse(saved);
  }
  updatePityUI();
}

/**
 * Initialize application
 */
async function init() {
  console.log('<´ Mystic Gacha - Initializing...');

  try {
    // Load card and pack data
    await loadData();

    // Load pity counter
    loadPityCounter();

    // Setup header buttons
    document.getElementById('volumeToggle').addEventListener('click', () => {
      const enabled = toggleSound();
      document.getElementById('volumeToggle').textContent = enabled ? '=
' : '=';
    });

    document.getElementById('inventoryBtn').addEventListener('click', () => {
      setState('inventory');
    });

    // Start at pack selection
    setState('selectingPack');

    console.log(' Initialization complete');
  } catch (error) {
    console.error('L Initialization failed:', error);
    document.getElementById('app').innerHTML = `
      <div class="error-panel text-center">
        <h2>Error Loading Game</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()" class="primary-btn">Retry</button>
      </div>
    `;
  }
}

// Save pity counter before page unload
window.addEventListener('beforeunload', () => {
  savePityCounter();
});

// Start the application
init();
