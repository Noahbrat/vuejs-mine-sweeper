<template>
  <div id="app">
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
    },
    onGameEnd(result) {
      if (this.$refs.menu) {
        this.$refs.menu.updateStatistics(result);
      }
    }
  },
  mounted() {
    this.showMenu = true;
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
</style>
