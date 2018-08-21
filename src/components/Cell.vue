<template>
    <font-awesome-icon v-if="isRevealed" :icon="display" class="game-cell" />
</template>

<script>

  export default {
    name: "Cell",
    data: function() {
      return {
        // clicked: false,
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
      cellClick() {
        // this.clicked = true;
        this.$emit('cell-click', this.w - 1, this.h - 1);
      },
      clicked() {
        return this.clicks[this.w - 1][this.h - 1];
      },
      clickedClass() {
        return this.clicked() ? 'clicked' : '';
      }
    },
    computed: {
      isRevealed() {
        return this.display;//this.clicked && this.display
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