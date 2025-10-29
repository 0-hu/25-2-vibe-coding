/**
 * reveal.js - Card Reveal Grid System
 * Handles 10-card grid display, flip animations, and reveal mechanics
 */

import { setState } from './main.js';
import { playSound } from './sound.js';

/**
 * Render reveal grid with 10 cards (face down)
 * @param {Array} cards - Array of 10 card objects
 */
export function renderRevealGrid(cards) {
  const app = document.getElementById('app');

  const html = `
    <div class="reveal-stage">
      <h2>Reveal Your Cards</h2>
      <p class="subtitle">Click each card to reveal, or use the button below</p>

      <button id="revealAllBtn" class="reveal-all-btn">( Reveal All</button>

      <div class="card-grid">
        ${cards.map((card, index) => `
          <div class="card-slot" data-index="${index}" data-flipped="false" data-rarity="${card.rarity}">
            <div class="card-inner">
              <!-- Front (�t) -->
              <div class="card-face card-back">
                <div class="card-back-pattern"></div>
                <div class="card-back-shine"></div>
              </div>

              <!-- Back (^t) -->
              <div class="card-face card-front">
                <img src="${card.image}" alt="${card.name}" loading="lazy">
                <div class="card-info">
                  <h3 class="card-name">${card.name}</h3>
                  <p class="card-type">${card.type}</p>
                  <p class="card-rarity rarity-${card.rarity}">${card.rarity.toUpperCase()}</p>
                  <p class="card-flavor">${card.flavor}</p>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Initialize card flip interactions
  initCardFlip(cards);
}

/**
 * Initialize card flip mechanics
 * @param {Array} cards - Array of card objects
 */
function initCardFlip(cards) {
  const slots = document.querySelectorAll('.card-slot');
  let flippedCount = 0;

  // Individual card click
  slots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
      if (slot.dataset.flipped === 'true') return;

      flipCard(slot, cards[index]);
      flippedCount++;

      // All cards revealed -> go to summary
      if (flippedCount === 10) {
        setTimeout(() => {
          setState('summary', { cards });
        }, 1000);
      }
    });

    // Add 3D tilt effect
    add3DTilt(slot);
  });

  // Reveal All button
  document.getElementById('revealAllBtn').addEventListener('click', () => {
    let delay = 0;

    slots.forEach((slot, index) => {
      if (slot.dataset.flipped === 'false') {
        setTimeout(() => {
          flipCard(slot, cards[index]);
        }, delay);
        delay += 150; // Stagger delay
      }
    });

    // Go to summary after all reveals
    setTimeout(() => {
      setState('summary', { cards });
    }, delay + 1000);
  });
}

/**
 * Flip a single card
 * @param {HTMLElement} slot - Card slot element
 * @param {Object} card - Card data object
 */
function flipCard(slot, card) {
  slot.dataset.flipped = 'true';
  slot.classList.add('flipped');
  slot.classList.add(`rarity-${card.rarity}`);

  // Play sound based on rarity
  playSound(card.rarity);

  // Add glare sweep for Epic/Mythic cards
  if (card.rarity === 'epic' || card.rarity === 'mythic') {
    setTimeout(() => {
      slot.classList.add('glare-sweep');
    }, 300);
  }
}

/**
 * Add 3D tilt effect on mouse move
 * @param {HTMLElement} cardElement - Card slot element
 */
function add3DTilt(cardElement) {
  const card = cardElement.querySelector('.card-inner');

  cardElement.addEventListener('mousemove', (e) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // -10 ~ 10�
    const rotateY = ((x - centerX) / centerX) * 10;

    const isFlipped = cardElement.dataset.flipped === 'true';
    const baseRotateY = isFlipped ? 180 : 0;

    card.style.transform = `
      rotateY(${baseRotateY + rotateY}deg)
      rotateX(${rotateX}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
  });

  cardElement.addEventListener('mouseleave', () => {
    const isFlipped = cardElement.dataset.flipped === 'true';
    card.style.transform = `rotateY(${isFlipped ? 180 : 0}deg) rotateX(0deg) scale3d(1, 1, 1)`;
  });
}
