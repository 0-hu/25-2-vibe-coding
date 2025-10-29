/**
 * packs.js - Card Pack and Probability System
 * Handles card data loading, probability calculations, and 10-card draws
 */

let cardsData = [];
let packsData = [];

/**
 * Load card and pack data from JSON files
 */
export async function loadData() {
  try {
    const [cardsRes, packsRes] = await Promise.all([
      fetch('data/cards.json'),
      fetch('data/packs.json')
    ]);

    cardsData = await cardsRes.json();
    packsData = await packsRes.json();

    console.log(`Loaded ${cardsData.length} cards and ${packsData.length} packs`);
    return { cardsData, packsData };
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

/**
 * Weighted random selection based on rarity weights
 * @param {Object} weights - { common: 70, rare: 20, epic: 9, mythic: 1 }
 * @returns {string} - Selected rarity
 */
function weightedRandom(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  for (const [rarity, weight] of Object.entries(weights)) {
    if (random < weight) return rarity;
    random -= weight;
  }

  // Fallback to common
  return 'common';
}

/**
 * Get a random card from a specific rarity pool
 * @param {string} rarity - Rarity level
 * @param {Array} pool - Array of card objects
 * @returns {Object} - Selected card
 */
function getCardByRarity(rarity, pool) {
  const rarityCards = pool.filter(card => card.rarity === rarity);

  if (rarityCards.length === 0) {
    console.warn(`No cards found for rarity: ${rarity}`);
    // Fallback to common cards
    return pool.filter(c => c.rarity === 'common')[0];
  }

  return rarityCards[Math.floor(Math.random() * rarityCards.length)];
}

/**
 * Draw 10 cards from a pack with pity system applied
 * @param {string} packId - Pack ID
 * @param {Object} pityCounter - Pity counter object
 * @returns {Array} - Array of 10 drawn cards
 */
export function draw10Cards(packId, pityCounter) {
  const pack = packsData.find(p => p.id === packId);

  if (!pack) {
    console.error(`Pack not found: ${packId}`);
    return [];
  }

  // Get card pool for this pack
  const pool = cardsData.filter(c => pack.pool.includes(c.id));

  const results = [];

  for (let i = 0; i < 10; i++) {
    let rarity = weightedRandom(pack.rarityWeights);

    // Epic Pity: Guarantee Epic or higher at 30 pulls
    if (pityCounter.pullsSinceLastEpic >= 29) {
      // 50% Epic, 50% Mythic when pity triggers
      rarity = Math.random() < 0.5 ? 'epic' : 'mythic';
      console.log('Epic pity triggered!');
    }

    // Mythic Pity: Guarantee Mythic at 90 pulls
    if (pityCounter.pullsSinceLastMythic >= 89) {
      rarity = 'mythic';
      console.log('Mythic pity triggered!');
    }

    const card = getCardByRarity(rarity, pool);
    results.push(card);

    // Update pity counters
    pityCounter.totalPulls++;
    pityCounter.pullsSinceLastEpic++;
    pityCounter.pullsSinceLastMythic++;

    // Reset counters when high rarity is obtained
    if (rarity === 'epic' || rarity === 'mythic') {
      pityCounter.pullsSinceLastEpic = 0;
    }

    if (rarity === 'mythic') {
      pityCounter.pullsSinceLastMythic = 0;
    }
  }

  console.log(`Drew 10 cards:`, results.map(c => `${c.name} (${c.rarity})`));
  return results;
}

/**
 * Test pity system (for development/debugging)
 */
export function testPitySystem() {
  console.log('=== Pity System Test ===');

  // Test 1: Epic Pity (30Œ)
  let pity = { pullsSinceLastEpic: 29, pullsSinceLastMythic: 50, totalPulls: 50 };
  const result1 = draw10Cards('pack_universal', pity);
  const hasEpicOrMythic = result1.some(c => c.rarity === 'epic' || c.rarity === 'mythic');
  console.log('Epic Pity Test (29Œ Ä):', hasEpicOrMythic ? ' PASS' : 'L FAIL');
  console.log('Epic Counter Reset:', pity.pullsSinceLastEpic < 10 ? ' PASS' : 'L FAIL');

  // Test 2: Mythic Pity (90Œ)
  pity = { pullsSinceLastEpic: 0, pullsSinceLastMythic: 89, totalPulls: 89 };
  const result2 = draw10Cards('pack_universal', pity);
  const hasMythic = result2.some(c => c.rarity === 'mythic');
  console.log('Mythic Pity Test (89Œ Ä):', hasMythic ? ' PASS' : 'L FAIL');
  console.log('Mythic Counter Reset:', pity.pullsSinceLastMythic < 10 ? ' PASS' : 'L FAIL');

  // Test 3: Probability Distribution (1000 pulls)
  const distribution = { common: 0, rare: 0, epic: 0, mythic: 0 };
  pity = { pullsSinceLastEpic: 0, pullsSinceLastMythic: 0, totalPulls: 0 };

  for (let i = 0; i < 100; i++) {
    const cards = draw10Cards('pack_universal', pity);
    cards.forEach(c => distribution[c.rarity]++);
  }

  console.log('Distribution after 1000 pulls:');
  console.log('Common:', (distribution.common / 1000 * 100).toFixed(1) + '% (expected ~70%)');
  console.log('Rare:', (distribution.rare / 1000 * 100).toFixed(1) + '% (expected ~20%)');
  console.log('Epic:', (distribution.epic / 1000 * 100).toFixed(1) + '% (expected ~9%)');
  console.log('Mythic:', (distribution.mythic / 1000 * 100).toFixed(1) + '% (expected ~1%)');
}

// Export data for use in other modules
export { cardsData, packsData };
