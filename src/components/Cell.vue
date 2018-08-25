<template>
    <div @click="onCellClick()" :class="isClass">
        <font-awesome-icon v-if="isRevealed" :icon="display" class="game-cell" />
    </div>
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
      onCellClick() {
        this.$emit('cell-click', [this.w - 1, this.h - 1]);
      }
    },
    computed: {
      isRevealed() {
        return (this.isMine && (!this.alive || this.victory)) || this.flagged || (this.hasClicked && this.display);
      },
      display() {
        return this.flagged ? 'flag' : (this.isMine ? (this.victory ? 'flag' : 'bomb') : this.dice[this.number]);
      },
      isClass() {
        return this.flagged ? 'flagged' : (this.hasClicked ? (this.isMine ? 'mine-clicked' : 'clicked') : '');
      }
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
    div.clicked {
        background-color: #bbb;
        border: inset 1px #aaa;
    }
    div.mine-clicked {
        background-color: red;
        border: inset 1px #aaa;
    }
    div.flagged {
        color: teal;
        border: inset 1px #ccc;
    }
</style>