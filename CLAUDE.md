# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue.js 3 Minesweeper game built with Vite. The application uses FontAwesome icons for game elements and implements a classic minesweeper experience with timing, flagging, and auto-reveal functionality.

## Common Commands

### Development
- `npm run serve` - Start Vite dev server with hot reload (http://localhost:8080)
- `npm run build` - Build for production (outputs to dist/)
- `npm run preview` - Serve the production build locally
- `npm run lint` - Run ESLint to check code style

### Setup
- `npm install` - Install all dependencies

## Architecture

### Component Structure
- **App.vue**: Root component that renders a single GameBoard with fixed dimensions (12x16)
- **GameBoard.vue**: Main game logic component that manages:
  - Game state (alive, victory, timing)
  - Mine placement and numbering
  - Cell interaction handling
  - Board initialization and reset
- **Cell.vue**: Individual cell component that handles:
  - Cell rendering with appropriate icons
  - Click event emission to parent
  - Visual state management (clicked, flagged, mine)

### Game Logic
- Board size: 12 width × 16 height (configurable via props)
- Mine density: 12% of total cells
- Game uses FontAwesome icons for mines, flags, numbers (dice icons), and smiley faces
- Timer starts on first cell click and stops on game end
- Auto-reveal functionality: clicking revealed numbered cells reveals adjacent unflagged cells if flag count matches

### State Management
GameBoard manages all game state through reactive data properties:
- `clicks[][]` - Track revealed cells
- `mines[][]` - Mine locations
- `numbers[][]` - Adjacent mine counts
- `flags[][]` - Flagged cell tracking
- Game timing and win/lose conditions

### Styling
- Uses FontAwesome for all game icons
- Scoped CSS in each component
- Classic minesweeper visual style with borders and cell states
- Color-coded numbers using dice icons (green=1, teal=2, blue=3, etc.)

### Dependencies
- Vue 3.5
- FontAwesome 7 (core, solid icons, Vue 3 integration)
- Vite 8 with @vitejs/plugin-vue (`vite.config.js`; `index.html` lives at the project root)
- ESLint 10 flat config (`eslint.config.js`) with eslint-plugin-vue `flat/essential` and ESLint recommended rules