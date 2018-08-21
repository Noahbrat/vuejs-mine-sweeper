<template>
    <div @click="cellClick()" :class="clickedClass">
        <font-awesome-icon v-if="isRevealed" :icon="display" class="game-cell" />
    </div>
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
    div {
        width: 100%;
        height: 100%;
        padding: 3px 0 0;
        background-color: #ddd;
        border: solid 1px #ddd;
    }
    div.clicked {
        background-color: #bbb;
        border: inset 1px #aaa;
    }
    .game-cell {
        width: 22px;
        height: 22px;
    }
</style>