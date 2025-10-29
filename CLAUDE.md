# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VibeCoding Card Pack Simulator**: A holographic card gacha/opening simulator web application featuring:
- Pokemon-cards-css style holographic card effects with liquid glass UI design
- 10-card pack opening experience with interactive tearing mechanics
- Card reveal animations with rarity-based effects and sound
- Inventory system with localStorage persistence
- Pity system (천장/ceiling) following modern gacha game standards

**Target Platform**: Desktop-first responsive web application
**Tech Stack**: Vanilla HTML/CSS/JavaScript with optional libraries (GSAP, Chart.js, Lottie)

## Development Commands

This is a static web project. Common commands:

```bash
# No build step required - open index.html directly in browser
# For local development server (if using):
npx serve .
# or
python -m http.server 8000
```

## Architecture Overview

### State Machine Flow
The application follows this state flow:
```
idle → selectingPack → tearing → revealingGrid → flipping → summary → inventory
```

**Guard conditions**:
- Drag progress ≥ 100% triggers automatic state transition
- All 10 cards flipped triggers transition to summary

### Planned Directory Structure

```
/
├── index.html                 # Main entry point
├── styles/
│   ├── base.css              # Base styles and CSS variables
│   ├── holo-card.css         # Pokemon-cards-css holographic effects
│   ├── liquid-glass.css      # Backdrop blur UI effects
│   ├── pack.css              # Pack opening stage animations
│   └── grid.css              # 10-card reveal grid layout
├── scripts/
│   ├── main.js               # State machine and routing
│   ├── packs.js              # Pack definitions and probability logic
│   ├── open-stage.js         # Drag-to-tear interaction
│   ├── reveal.js             # 10-card grid and flip logic
│   └── inventory.js          # LocalStorage management and sorting
├── data/
│   ├── cards.json            # Card definitions
│   └── packs.json            # Pack configurations
└── assets/                   # Card artwork, textures, sounds
```

### Data Models

**Rarity System**:
- Common: 70% weight
- Rare: 20% weight
- Epic: 9% weight
- Mythic: 1% weight

**Key Data Structures**:
```javascript
Pack: { id, name, theme, rarityWeights?, pool(cardIds[]) }
CardDefinition: { id, name, image, rarity, flavor }
OwnedCard: { cardId, ts, serial, packId }
```

**LocalStorage Keys**:
- `inventory`: Array of owned cards
- `stats`: Opening statistics
- `pityCounters`: Pity system tracking for guaranteed rare pulls

## Core Interaction Implementations

### 1. Pack Tearing (Drag-to-Open)
- Uses Pointer Events to track drag progress (0-100%)
- Updates `clip-path` or `mask` on wrapping layer based on progress
- At threshold: trigger particle/flash effects and dissolve animation
- Implementation in: `scripts/open-stage.js`

### 2. Card Flip Animation
- Each card has `data-flipped="false"` attribute
- Click toggles to `true`, applies CSS class for `rotateY(180deg)`
- Uses `backface-visibility: hidden` on front/back faces
- First reveal triggers rarity-based holographic sweep animation
- Implementation in: `scripts/reveal.js`

### 3. Holographic Effects (pokemon-cards-css style)
- `perspective` container with cursor-based 3D tilt
- Mouse offset from card center drives `rotateX`/`rotateY`
- Conic gradient + noise texture overlay for foil specular effect
- Animated `background-position`/`mask-position` for glare sweep
- Implementation in: `styles/holo-card.css`

### 4. Liquid Glass UI
- Uses `backdrop-filter: blur(...)` on panels/modals/header
- Semi-transparent background with gradient highlight sweep
- Applied minimally to: header, result panel, modals
- Implementation in: `styles/liquid-glass.css`

### 5. Sound System
- Rarity-based sounds on card reveal:
  - Common: subtle flip
  - Rare: chime
  - Epic: fanfare
  - Mythic: dramatic reveal
- Default volume: 50%
- Sound files in: `assets/sounds/`

### 6. "Reveal All" Feature
- Button appears in reveal stage
- Automatically flips all remaining cards with staggered timing
- Also supports manual one-by-one clicking

## Project Requirements (from plan.md)

**Must Include**:
- 10-card pack opening flow with drag-to-tear interaction
- Holographic card effects with mouse-based 3D tilt
- Liquid glass effect on UI panels (minimalist approach)
- Rarity-based reveal animations and sounds
- Pity system display (show pulls until guaranteed rare)
- Both "Reveal All" button and manual clicking
- Inventory with duplicate card count stacking
- Desktop-first responsive design
- Placeholder card artwork (to be replaced later)
- Card metadata: name, rarity, flavor text (no stats)

**Development Timeline**:
- Day 1: Layout, pack selection, drag-to-tear MVP, 10-card grid + flip
- Day 2: Holographic effects, liquid glass polish, result summary, inventory, README + GIF captures

## Submission Requirements

Per `vibecoding_submission_guide.md`:

**Required in README.md**:
1. Project introduction (Korean or English)
2. Implemented features list
3. How to run (open index.html or use local server)
4. Tech stack used
5. Additional notes (browser requirements, permissions, etc.)

**Demo Assets**:
- GIF 1: Pack drag-to-tear (1.5s)
- GIF 2: Rare card reveal moment (1.5s)
- GIF 3: Inventory sorting/filtering (1.5s)

**Submission Format**: GitHub public repository link OR zip file named `이름_프로젝트명.zip`

## Important Conventions

**Placeholder Strategy**: Use temporary card images that can be easily replaced by updating `data/cards.json` image paths

**State Management**: Keep state machine transitions explicit in `scripts/main.js` with clear guard conditions

**Animation Performance**: Prefer CSS transitions/keyframes with JS-triggered class toggles over direct JS animation for smoother 60fps

**Accessibility Note**: This is a visual/interactive demo - focus on core experience over ARIA/a11y initially

**No Build Step**: Keep as vanilla as possible to meet submission requirements; libraries should be CDN-linked if used
