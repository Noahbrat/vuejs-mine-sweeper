<template>
    <font-awesome-icon v-if="isRevealed" :icon="display" class="game-cell" />
</template>

<script>

  export default {
    name: "Cell",
    data: function() {
      return {
        dice: [
          "",
          "dice-one",
          "dice-two",
          "dice-three",
          "dice-four",
          "dice-five",
          "dice-six",
        ]
      }
    },
    props: {
      w: Number,
      h: Number,
      number: Number,
      isMine: Boolean,
      hasClicked: Boolean,
      flagged: Boolean,
      alive: Boolean,
      victory: Boolean,
    },
    methods: {
    },
    computed: {
      isRevealed() {
        return (this.isMine && (!this.alive || this.victory)) || this.flagged || (this.hasClicked && this.display);
      },
      display() {
        return this.flagged ? 'flag' : (this.isMine ? (this.victory ? 'flag' : 'bomb') : this.dice[this.number]);
      },
    },
    components: {
    },
  }
</script>

<style scoped>
    .game-cell {
        width: 22px;
        height: 22px;
    }
</style>