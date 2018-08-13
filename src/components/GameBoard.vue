<template>
    <table>
        <tr v-for="h in height" :key="h">
            <td v-for="w in width" :key="w">
                <Cell :id="'cell_' + w + '_' + h" v-bind:w="w" v-bind:h="h" v-on:cell-click="onCellClick"/>
            </td>
        </tr>
    </table>
</template>

<script>
  import Cell from './Cell.vue'

  export default {
    name: "GameBoard",
    props: {
      width: Number,
      height: Number
    },
    components: {
      Cell
    },
    methods: {
      onCellClick: function (/*w, h*/) {
        // console.log(w);
        // console.log(h);
      }
    },
  }
</script>

<style scoped>
    table {
        margin: auto;
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