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
      clicks: Array,
    },
    methods: {
    },
    computed: {
      isRevealed() {
        return this.hasClicked && this.display
      },
      display() {
        return this.isMine ? "bomb" : this.dice[this.number];
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