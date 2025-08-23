<template>
  <div id="app" :class="['theme-' + gameSettings.theme]">
    <div class="game-header">
      <h1>Minesweeper</h1>
      <button @click="showMenu = true" class="menu-btn">
        <font-awesome-icon icon="bars" />
        Menu
      </button>
    </div>
    <GameBoard 
      v-if="currentDifficulty"
      ref="gameBoard"
      :key="difficultyKey"
      :width="currentDifficulty.width" 
      :height="currentDifficulty.height"
      :mine-count="currentDifficulty.mines"
      :settings="gameSettings"
      @game-end="onGameEnd"
    />
    <div v-else class="no-game">
      <p>Click Menu to start a new game</p>
      <button @click="showMenu = true" class="start-btn">
        <font-awesome-icon icon="play" />
        Start Game
      </button>
    </div>
    
    <GameMenu 
      :show="showMenu" 
      @close="showMenu = false"
      @new-game="onNewGame"
      @settings-changed="onSettingsChanged"
      ref="menu"
    />
  </div>
</template>

<script>
import GameBoard from './components/GameBoard.vue'
import GameMenu from './components/Menu.vue'

export default {
  name: 'app',
  data() {
    return {
      currentDifficulty: null,
      difficultyKey: 0,
      showMenu: false,
      gameSettings: {
        autoFlag: false,
        showTimer: true,
        showMineCount: true,
        theme: 'classic'
      }
    }
  },
  components: {
    GameBoard,
    GameMenu
  },
  methods: {
    onNewGame(difficulty) {
      this.currentDifficulty = difficulty;
      this.difficultyKey++;
    },
    onSettingsChanged(settings) {
      this.gameSettings = { ...settings };
      this.updateBodyTheme();
    },
    onGameEnd(result) {
      if (this.$refs.menu) {
        this.$refs.menu.updateStatistics(result);
      }
    },
    updateBodyTheme() {
      // Remove all theme classes from body
      document.body.classList.remove('theme-classic', 'theme-modern', 'theme-dark');
      // Add current theme class to body
      document.body.classList.add('theme-' + this.gameSettings.theme);
    }
  },
  mounted() {
    this.showMenu = true;
    this.updateBodyTheme();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  margin: 0;
  color: #2c3e50;
}

.menu-btn {
  background: #c0c0c0;
  border: 2px solid #808080;
  border-style: outset;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 0.9em;
}

.menu-btn:hover {
  background: #d0d0d0;
}

.menu-btn:active {
  border-style: inset;
}

.no-game {
  padding: 60px 20px;
  color: #666;
}

.no-game p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.start-btn {
  background: #007bff;
  color: white;
  border: 2px solid #0056b3;
  border-style: outset;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
}

.start-btn:hover {
  background: #0056b3;
}

.start-btn:active {
  border-style: inset;
}

/* Theme Styles */
/* Classic Theme (Default) */
.theme-classic {
  background: #c0c0c0;
}

.theme-classic h1 {
  color: #2c3e50;
}

/* Modern Theme */
.theme-modern {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.theme-modern #app {
  background: transparent;
}

.theme-modern h1 {
  color: #2d3748;
  font-weight: 300;
  letter-spacing: 1px;
}

.theme-modern .menu-btn {
  background: #4299e1;
  color: white;
  border: 2px solid #3182ce;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.theme-modern .menu-btn:hover {
  background: #3182ce;
  transform: translateY(-1px);
}

.theme-modern .menu-btn:active {
  border-style: solid;
  transform: translateY(0);
}

.theme-modern .start-btn {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.theme-modern .start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.theme-modern .start-btn:active {
  border-style: solid;
  transform: translateY(-1px);
}

/* Dark Theme */
.theme-dark {
  background: #1a202c;
  color: #e2e8f0;
  min-height: 100vh;
}

/* Global body styles for themes */
body.theme-dark {
  background: #1a202c !important;
  margin: 0;
  padding: 0;
}

body.theme-modern {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
  margin: 0;
  padding: 0;
}

body.theme-classic {
  background: #c0c0c0 !important;
  margin: 0;
  padding: 0;
}

.theme-dark #app {
  background: transparent;
}

.theme-dark h1 {
  color: #f7fafc;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.theme-dark .menu-btn {
  background: #4a5568;
  color: #e2e8f0;
  border: 2px solid #2d3748;
}

.theme-dark .menu-btn:hover {
  background: #2d3748;
}

.theme-dark .no-game {
  color: #a0aec0;
}

.theme-dark .start-btn {
  background: #805ad5;
  border: 2px solid #6b46c1;
}

.theme-dark .start-btn:hover {
  background: #6b46c1;
}
</style>
