<template>
    <div class="board-container">
        <font-awesome-icon @click="newGame" :icon="smiley" class="butz" />
        <font-awesome-icon @click="flagToggle" :icon="flagOrMine" class="butz" />
        <table>
            <tr v-for="h in height" :key="h">
                <Cell v-for="w in width" :key="w"
                      v-bind:w="w"
                      v-bind:h="h"
                      v-bind:number="numbers[w - 1][h - 1]"
                      v-bind:is-mine="mines[w - 1][h - 1]"
                      v-bind:has-clicked="clicks[w - 1][h - 1]"
                      v-bind:flagged="flags[w - 1][h -1]"
                      v-bind:alive="alive"
                      v-bind:victory="victory"
                      v-on:cell-click="onCellClick"
                />
            </tr>
        </table>
        <h1 v-if="victory">You Win!</h1>
    </div>
</template>

<script>
  import Cell from './Cell.vue'

  export default {
    name: "GameBoard",
    data: function() {
      return {
        alive: true,
        victory: false,
        mineCnt: 0,
        revealed: 0,
        clicks: [],
        mines: [],
        numbers: [],
        flags: [],
        isFlagging: false,
      }
    },
    props: {
      width: Number,
      height: Number,
    },
    components: {
      Cell
    },
    methods: {
      flagToggle() {
        this.isFlagging = !this.isFlagging;
      },
      onCellClick(w, h, isFlag = this.isFlagging) {
        if (w.constructor === Array) {
          h = w[1];
          w = w[0];
        }
        const that = this;
        if (this.clicks[w][h] && this.numbers[w][h] > 0 && !this.flags[w][h]) {
          let flagsAround = 0
          const aroundMe = this.aroundCell(w, h)
          aroundMe.forEach(function (cell) {
            if (that.flags[cell.w][cell.h]) {
              flagsAround++
            }
          })
          if (flagsAround >= that.numbers[w][h]) {
            aroundMe.forEach(function (cell) {
              if (!that.clicks[cell.w][cell.h] && !that.flags[cell.w][cell.h]) {
                that.onCellClick(cell.w, cell.h, false);
              }
            })
          }
        } else if (isFlag) {
          let flags = this.flags[w]
          flags[h] = !flags[h]
          this.flags.splice(w, 1, flags)
        } else if (!this.flags[w][h] && !this.clicks[w][h]) {
          let clicks = this.clicks[w]
          clicks[h] = true
          this.clicks.splice(w, 1, clicks)
          if (this.mines[w][h]) {
            this.alive = false
          } else {
            this.revealed++;
            if (this.revealed === this.remaining) {
              this.victory = true;
            } else if (this.numbers[w][h] === 0) {
              this.aroundCell(w, h).forEach(function (cell) {
                if (!that.clicks[cell.w][cell.h]) {
                  that.onCellClick(cell.w, cell.h, false)
                }
              })
            }
          }
        }
      },
      newGame() {
        for (let w = 0; w < this.width; w++) {
          let clicks = this.clicks[w];
          let mines = this.mines[w];
          let numbers = this.numbers[w];
          let flags = this.flags[w];
          for (let h = 0; h < this.height; h++) {
            clicks[h] = false;
            mines[h] = false;
            numbers[h] = 0;
            flags[h] = false;
          }
          this.clicks.splice(w, 1, clicks);
          this.mines.splice(w, 1, mines);
          this.numbers.splice(w, 1, numbers);
          this.flags.splice(w, 1, flags);
        }
        this.alive = true;
        this.victory = false;
        this.isFlagging = false;
        this.revealed = 0;
        let assignedCnt = 0;
        while (assignedCnt < this.mineCnt) {
          const w = Math.floor(Math.random() * this.width);
          const h = Math.floor(Math.random() * this.height);
          if (!this.mines[w][h]) {
            let mines = this.mines[w];
            assignedCnt++;
            mines[h] = true;
            this.mines.splice(w, 1, mines);
            this.incrementAround(w, h);
          }
        }
      },
      aroundCell: function (w, h) {
        let around = [];
        if (w > 0) {
          around.push({w: w - 1, h: h});
        }
        if (w > 0 && h > 0) {
          around.push({w: w - 1, h: h - 1});
        }
        if (w > 0 && h < this.height - 1) {
          around.push({w: w - 1, h: h + 1});
        }
        if (w < this.width - 1) {
          around.push({w: w + 1, h: h});
        }
        if (w < this.width - 1 && h > 0) {
          around.push({w: w + 1, h: h - 1});
        }
        if (w < this.width - 1 && h < this.height - 1) {
          around.push({w: w + 1, h: h + 1});
        }
        if (h > 0) {
          around.push({w: w, h: h - 1});
        }
        if (h < this.height - 1) {
          around.push({w: w, h: h + 1});
        }
        return around;
      },
      incrementAround: function (w, h) {
        const that = this;
        this.aroundCell(w, h).forEach(function (cell) {
          that.numbers[cell.w][cell.h]++;
        });
      },
    },
    computed: {
      remaining() {
        return (this.width * this.height) - this.mineCnt;
      },
      smiley() {
        return this.victory ? 'grin-hearts' : (this.alive ? 'smile' : 'angry');
      },
      flagOrMine() {
        return this.isFlagging ? 'flag' : 'bomb';
      }
    },
    created: function() {
      for (let w = 0; w < this.width; w++) {
        if (typeof this.clicks[w] === "undefined") {
          this.clicks[w] = [];
        }
        if (typeof this.mines[w] === "undefined") {
          this.mines[w] = [];
        }
        if (typeof this.numbers[w] === "undefined") {
          this.numbers[w] = [];
        }
        if (typeof this.flags[w] === "undefined") {
          this.flags[w] = [];
        }
      }
      this.mineCnt = Math.floor((this.width * this.height) * .12);
      this.newGame();
    },
  }
</script>

<style scoped>
    .board-container {
        display: inline-block;
    }
    table {
        margin: auto;
        border-spacing: 0;
    }
    .butz {
        width: 35px;
        height: 35px;
        margin: 10px 18px;
        cursor: pointer;
    }
    .fa-flag {
        color: purple;
    }
    .fa-bomb {
    }
    .fa-angry {
        color: darkred;
    }
    .fa-smile {
        color: orange;
    }
    .fa-grin-hearts {
        color: orangered;
    }
</style>