/**
 * inventory.js - Inventory Management System
 * Handles card storage, filtering, sorting, and UI rendering
 */

import { setState } from './main.js';

const STORAGE_KEY = 'mystic_gacha_inventory';

/**
 * Load inventory from localStorage
 * @returns {Array} - Array of owned card objects
 */
export function loadInventory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading inventory:', error);
    return [];
  }
}

/**
 * Save cards to inventory
 * @param {Array} newCards - Array of newly obtained cards
 * @returns {Array} - Updated inventory
 */
export function saveToInventory(newCards) {
  const inventory = loadInventory();

  newCards.forEach(card => {
    const existing = inventory.find(item => item.cardId === card.id);

    if (existing) {
      // Increment count for duplicate cards
      existing.count++;
      existing.lastObtained = Date.now();
    } else {
      // Add new card to inventory
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

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  console.log(`Saved ${newCards.length} cards to inventory. Total unique: ${inventory.length}`);

  return inventory;
}

/**
 * Sort inventory by criteria
 * @param {Array} inventory - Inventory array
 * @param {string} criteria - Sort criteria
 * @returns {Array} - Sorted inventory
 */
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

/**
 * Filter inventory by criteria
 * @param {Array} inventory - Inventory array
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered inventory
 */
export function filterInventory(inventory, filters = {}) {
  return inventory.filter(item => {
    if (filters.rarity && item.rarity !== filters.rarity) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}

/**
 * Render full inventory UI
 */
export function renderInventory() {
  const app = document.getElementById('app');

  let inventory = loadInventory();
  let currentSort = 'rarity';
  let currentFilters = {};

  const render = () => {
    const filtered = filterInventory(inventory, currentFilters);
    const sorted = sortInventory(filtered, currentSort);

    const totalCards = inventory.reduce((sum, item) => sum + item.count, 0);

    const html = `
      <div class="inventory-view">
        <div class="inventory-header">
          <div class="inventory-title">
            <h2>My Collection</h2>
            <p class="inventory-stats">${inventory.length} unique cards | ${totalCards} total cards</p>
          </div>
          <button id="backToMenuBtn" class="secondary-btn">ê Back to Menu</button>
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

        ${sorted.length > 0 ? `
          <div class="inventory-grid">
            ${sorted.map(item => `
              <div class="inventory-card rarity-border-${item.rarity}">
                <div class="card-count-badge">◊${item.count}</div>
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="inventory-card-info">
                  <h4>${item.name}</h4>
                  <p class="card-type-label">${item.type}</p>
                  <p class="card-rarity rarity-${item.rarity}">${item.rarity.toUpperCase()}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <p>No cards found</p>
          </div>
        `}
      </div>
    `;

    app.innerHTML = html;

    // Event listeners
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.value = currentSort;
    sortSelect.addEventListener('change', (e) => {
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
