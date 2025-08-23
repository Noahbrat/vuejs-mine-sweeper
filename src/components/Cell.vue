<template>
    <td @click.exact="onCellClick()" @click.shift="onShiftClick()" @contextmenu.prevent="onRightClick()" :class="isClass">
        <font-awesome-icon v-if="isRevealed" :icon="display" class="game-cell" />
    </td>
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
        if (this.alive) {
          this.$emit('cell-click', [this.w - 1, this.h - 1]);
        }
      },
      onRightClick() {
        if (this.alive) {
          this.$emit('cell-flag', [this.w - 1, this.h - 1]);
        }
      },
      onShiftClick() {
        if (this.alive) {
          this.$emit('cell-flag', [this.w - 1, this.h - 1]);
        }
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
        return (this.flagged || (this.victory && this.isMine)) ? 'flagged' : (this.hasClicked ? (this.isMine ? 'mine clicked' : 'clicked') : '');
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
        margin-top: 2px;
    }
    tr:first-child td {
        border-top: solid 1px slategray;
    }
    td:first-child {
        border-left: solid 1px slategray;
    }
    td {
        width: 30px;
        height: 30px;
        background-color: #ccc;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
        padding: 0;
        border-bottom: solid 1px slategray;
        border-right: solid 1px slategray;
    }
    td.clicked {
        border-bottom: inset 1px darkslategray;
        border-right: inset 1px darkslategray;
        background-color: #aaa;
    }
    td.mine {
        background-color: red;
    }
    .flagged {
        color: purple;
    }
    .fa-dice-one {
        color: green;
    }
    .fa-dice-two {
        color: teal;
    }
    .fa-dice-three {
        color: blue;
    }
    .fa-dice-four {
        color: blueviolet;
    }
    .fa-dice-five {
        color: rebeccapurple;
    }
    .fa-dice-six {
        color: mediumvioletred;
    }

    /* Theme-specific Cell styles */
    .theme-modern td {
        background-color: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .theme-modern td:hover {
        background-color: #edf2f7;
        transform: scale(1.02);
    }

    .theme-modern td.clicked {
        background-color: #e2e8f0;
        border: 1px solid #cbd5e0;
    }

    .theme-modern td.mine {
        background-color: #feb2b2;
        border: 1px solid #f56565;
    }

    .theme-dark td {
        background-color: #4a5568;
        border: 1px solid #2d3748;
        color: #e2e8f0;
    }

    .theme-dark td:hover {
        background-color: #2d3748;
    }

    .theme-dark td.clicked {
        background-color: #2d3748;
        border: 1px solid #1a202c;
    }

    .theme-dark td.mine {
        background-color: #e53e3e;
        border: 1px solid #c53030;
    }

    .theme-dark .flagged {
        color: #d53f8c;
    }

    .theme-dark .fa-dice-one {
        color: #48bb78;
    }

    .theme-dark .fa-dice-two {
        color: #38b2ac;
    }

    .theme-dark .fa-dice-three {
        color: #4299e1;
    }

    .theme-dark .fa-dice-four {
        color: #9f7aea;
    }

    .theme-dark .fa-dice-five {
        color: #ed64a6;
    }

    .theme-dark .fa-dice-six {
        color: #f687b3;
    }
</style>