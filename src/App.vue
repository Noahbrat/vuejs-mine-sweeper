<template>
  <div id="app">
    <h1>Minesweeper</h1>
    <DifficultySelector @difficulty-changed="onDifficultyChanged" />
    <GameBoard 
      v-if="currentDifficulty"
      :key="difficultyKey"
      :width="currentDifficulty.width" 
      :height="currentDifficulty.height"
      :mine-count="currentDifficulty.mines"
    />
  </div>
</template>

<script>
import GameBoard from './components/GameBoard.vue'
import DifficultySelector from './components/DifficultySelector.vue'

export default {
  name: 'app',
  data() {
    return {
      currentDifficulty: null,
      difficultyKey: 0
    }
  },
  components: {
    GameBoard,
    DifficultySelector
  },
  methods: {
    onDifficultyChanged(difficulty) {
      this.currentDifficulty = difficulty;
      this.difficultyKey++;
    }
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

h1 {
  margin-bottom: 20px;
  color: #2c3e50;
}
</style>
