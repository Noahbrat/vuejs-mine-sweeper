<template>
    <div class="board-container">
        <span v-if="settings.showMineCount" class="mine-count">{{remainingMines.toString().padStart(3, '0')}}</span>
        <span v-if="settings.showTimer" class="time">{{gameTime.toString().padStart(3, '0')}}</span>
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
        minesPlaced: false,
      }
    },
    props: {
      width: Number,
      height: Number,
      mineCount: Number,
      settings: {
        type: Object,
        default: () => ({
          autoFlag: false,
          showTimer: true,
          showMineCount: true,
          theme: 'classic'
        })
      }
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
          if (!this.startTime) {
            this.startTime = new Date();
            this.timeout = setInterval(this.setGameTime, 1000);
            if (!this.minesPlaced) {
              this.placeMines(w, h);
            }
          }
          let clicks = this.clicks[w]
          clicks[h] = true
          this.clicks.splice(w, 1, clicks)
          if (this.mines[w][h]) {
            this.alive = false;
            this.endTime = new Date();
            if (this.timeout) {
              clearInterval(this.timeout);
            }
            this.$emit('game-end', { won: false, time: this.gameTime });
          } else {
            this.revealed++;
            if (this.revealed === this.remaining) {
              this.victory = true;
              this.endTime = new Date();
              if (this.timeout) {
                clearInterval(this.timeout);
              }
              this.$emit('game-end', { won: true, time: this.gameTime });
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
        this.minesPlaced = false;
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
      placeMines(excludeW, excludeH) {
        let assignedCnt = 0;
        while (assignedCnt < this.mineCnt) {
          const w = Math.floor(Math.random() * this.width);
          const h = Math.floor(Math.random() * this.height);
          if (!this.mines[w][h] && !(w === excludeW && h === excludeH)) {
            let mines = this.mines[w];
            assignedCnt++;
            mines[h] = true;
            this.mines.splice(w, 1, mines);
            this.incrementAround(w, h);
          }
        }
        this.minesPlaced = true;
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
      flagCount() {
        let count = 0;
        for (let w = 0; w < this.width; w++) {
          for (let h = 0; h < this.height; h++) {
            if (this.flags[w] && this.flags[w][h]) {
              count++;
            }
          }
        }
        return count;
      },
      remainingMines() {
        return Math.max(0, this.mineCnt - this.flagCount);
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
      this.mineCnt = this.mineCount;
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
    .mine-count {
        font-family: 'Roboto Mono', monospace;
        font-size: 36px;
        margin: -30px 10px 0;
        display: inline-block;
        vertical-align: text-top;
        color: #d73027;
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

    /* Theme-specific GameBoard styles */
    .theme-modern .board-container {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
    }

    .theme-modern .butz {
        border-radius: 6px;
        transition: all 0.2s ease;
    }

    .theme-modern .butz:hover {
        transform: scale(1.1);
    }

    .theme-modern .time,
    .theme-modern .mine-count {
        color: #4a5568;
        background: rgba(255, 255, 255, 0.8);
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
    }

    .theme-dark .board-container {
        background: #2d3748;
        border: 2px solid #4a5568;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .theme-dark .time,
    .theme-dark .mine-count {
        color: #e2e8f0;
        background: #1a202c;
        border: 1px solid #4a5568;
        border-radius: 4px;
        padding: 4px 8px;
    }

    .theme-dark .butz {
        color: #e2e8f0;
        filter: brightness(1.2);
    }

    .theme-dark .fa-angry {
        color: #f56565;
    }

    .theme-dark .fa-smile {
        color: #ed8936;
    }

    .theme-dark .fa-grin-hearts {
        color: #f6ad55;
    }

    .theme-dark h2 {
        color: #48bb78;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        background: rgba(72, 187, 120, 0.1);
        padding: 10px 20px;
        border-radius: 8px;
        border: 1px solid #48bb78;
    }

    .theme-modern h2 {
        color: #667eea;
        text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
        background: rgba(102, 126, 234, 0.1);
        padding: 10px 20px;
        border-radius: 8px;
        border: 1px solid rgba(102, 126, 234, 0.3);
    }
</style>
