<template>
    <span>
        <table>
            <tr v-for="h in height" :key="h">
                <td v-for="w in width" :key="w">
                    <div @click="onCellClick(w - 1, h - 1)" :class="clickedClass(w - 1, h - 1)">
                        <Cell :id="'cell_' + w + '_' + h"
                              v-bind:w="w"
                              v-bind:h="h"
                              v-bind:number="numbers[w - 1][h - 1]"
                              v-bind:is-mine="mines[w - 1][h - 1]"
                              v-bind:has-clicked="clicks[w - 1][h - 1]"
                              v-bind:flagged="flags[w - 1][h -1]"
                              v-bind:alive="alive"
                        />
                    </div>
                </td>
            </tr>
        </table>
        <form class="form">
            <span class="switch-field">
              <input type="radio" id="switch_left" name="switch" v-model="flagToggle" value="mine" checked/>
              <label for="switch_left">Mine</label>
              <input type="radio" id="switch_right" name="switch" v-model="flagToggle" value="flag" />
              <label for="switch_right">Flag</label>
            </span>
            <button @click="newGame" type="button">New Game</button>
        </form>
    </span>
</template>

<script>
  import Cell from './Cell.vue'

  export default {
    name: "GameBoard",
    data: function() {
      return {
        alive: true,
        mineCnt: 0,
        clicks: [],
        mines: [],
        numbers: [],
        flags: [],
        flagToggle: "mine",
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
      onCellClick(w, h) {
        const that = this;
        if (this.flagToggle === 'flag') {
          let flags = this.flags[w];
          flags[h] = !flags[h];
          this.flags.splice(w, 1, flags);
        } else if (!this.flags[w][h]) {
          let clicks = this.clicks[w];
          clicks[h] = true;
          this.clicks.splice(w, 1, clicks);
          if (this.mines[w][h]) {
            this.alive = false;
          } else if (this.numbers[w][h] === 0) {
            this.aroundCell(w, h).forEach(function (cell) {
              if (!that.clicks[cell.w][cell.h]) {
                that.onCellClick(cell.w, cell.h);
              }
            });
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
      clickedClass(w, h) {
        return this.clicks[w][h] ? (this.mines[w][h] ? 'mine-clicked' : 'clicked') : '';
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
  }
</script>

<style scoped>
    table {
        margin: auto;
        border-spacing: 0;
    }
    td {
        width: 30px;
        height: 30px;
        background-color: #ccc;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
    }
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
    div.mine-clicked {
        background-color: red;
        border: inset 1px #aaa;
    }
</style>