<template>
    <table>
        <tr v-for="h in height" :key="h">
            <td v-for="w in width" :key="w">
                <Cell :id="'cell_' + w + '_' + h"
                      v-bind:w="w"
                      v-bind:h="h"
                      v-bind:number="numbers[w - 1][h - 1]"
                      v-bind:is-mine="mines[w - 1][h - 1]"
                      v-bind:has-clicked="clicks[w - 1][h - 1]"
                      v-bind:clicks="clicks"
                      v-on:cell-click="onCellClick" />
                <!--has-clicked="clicks[w - 1][h - 1]"-->
            </td>
        </tr>
    </table>
</template>

<script>
  import Cell from './Cell.vue'

  export default {
    name: "GameBoard",
    data: function() {
      return {
        clicks: [],
        mines: [],
        numbers: [],
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
      onCellClick: function (w, h) {
        this.clicks[w].splice(h, 1, true);
//        this.clicks[w][h] = true;
        console.log(this.clicks[w][h]);
        console.log('game board cell click w:' + w + ' h:' +h);
        if (this.mines[w][h] === false && this.numbers[w][h] === 0) {
          console.log('zero');
        }
        console.log(this.clicks);
      },
      test: function (w, h) {
        if (this.clicks[w][h]) {
          return true;
        }
        return this.clicks[w][h];
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
      didClick(w, h) {
         return this.clicks[w][h];
      }
    },
    beforeCreate: function() {
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
        for (let h = 0; h < this.height; h++) {
          this.clicks[w][h] = false;
          this.mines[w][h] = false;
          this.numbers[w][h] = 0;
        }
      }
      let assignedCnt = 0;
      const mineCnt = Math.floor((this.width * this.height) / 10);
      while (assignedCnt < mineCnt) {
        const w = Math.floor(Math.random() * this.width);
        const h = Math.floor(Math.random() * this.height);
        if (!this.mines[w][h]) {
          assignedCnt++;
          this.mines[w][h] = true;
          this.incrementAround(w, h);
        }
      }
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
</style>