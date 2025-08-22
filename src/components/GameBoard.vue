<template>
    <div class="board-container">
        <span class="time">{{gameTime.toString().padStart(3, '0')}}</span>
        <font-awesome-icon @click="newGame" :icon="smiley" class="butz" />
        <font-awesome-icon @click="flagToggle" :icon="flagOrMine" class="butz"
                           :class="flagIconClass" />
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
                      v-on:cell-flag="onCellFlag"
                />
            </tr>
        </table>
        <h2 v-if="victory">You Win!</h2>
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
        isShiftHeld: false,
        startTime: 0,
        endTime: 0,
        gameTime: 0,
        timeout: false,
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
      setGameTime() {
        if (!this.startTime) {
          this.gameTime = 0;
        } else {
          let endTime = (this.endTime ? this.endTime : new Date());
          this.gameTime = Math.round((endTime - this.startTime) / 1000);
        }
      },
      flagToggle() {
        this.isFlagging = !this.isFlagging;
      },
      onCellFlag(w, h) {
        this.onCellClick(w, h, true);
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
          if (!this.startTime) {
            this.startTime = new Date();
            this.timeout = setInterval(this.setGameTime, 1000);
          }
          if (this.mines[w][h]) {
            this.alive = false;
            this.endTime = new Date();
            if (this.timeout) {
              clearInterval(this.timeout);
            }
          } else {
            this.revealed++;
            if (this.revealed === this.remaining) {
              this.victory = true;
              this.endTime = new Date();
              if (this.timeout) {
                clearInterval(this.timeout);
              }
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
        this.startTime = 0;
        this.endTime = 0;
        this.gameTime = 0;
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
        return (this.isFlagging || this.isShiftHeld) ? 'flag' : 'bomb';
      },
      flagIconClass() {
        if (this.flagOrMine === 'flag') {
          return this.isShiftHeld ? 'flag-temporary' : 'flag-permanent';
        }
        return '';
      },
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
    mounted() {
      this.handleKeyDown = (event) => {
        if (event.key === 'Shift') {
          this.isShiftHeld = true;
        }
      };
      this.handleKeyUp = (event) => {
        if (event.key === 'Shift') {
          this.isShiftHeld = false;
        }
      };
      this.handleWindowBlur = () => {
        this.isShiftHeld = false;
      };

      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      window.addEventListener('blur', this.handleWindowBlur);
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      window.removeEventListener('blur', this.handleWindowBlur);
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
        width: 100%;
    }
    .butz {
        width: 30px;
        height: 30px;
        margin: 8px 15px;
        cursor: pointer;
    }
    .time {
        font-family: 'Roboto Mono', monospace;
        font-size: 36px;
        margin: -30px 10px 0;
        display: inline-block;
        vertical-align: text-top;
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
    .flag-temporary {
        opacity: 0.75;
        transform: scale(1.05);
        transition: all 200ms ease-in-out;
    }
    .flag-permanent {
        opacity: 1;
        transition: all 200ms ease-in-out;
    }
</style>
