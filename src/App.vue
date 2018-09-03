<template>
  <div id="app">
    <GameBoard v-bind:width=12 v-bind:height=16 />
  </div>
</template>

<script>
import GameBoard from './components/GameBoard.vue'

export default {
  name: 'app',
  components: {
    GameBoard
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
}
</style>
