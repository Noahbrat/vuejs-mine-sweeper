<template>
    <font-awesome-icon :icon="icon" @click="cellClick()" class="game-cell" />
</template>

<script>

  export default {
    name: "Cell",
    data: function() {
      return {
        icon: "flag"
      }
    },
    props: {
      w: Number,
      h: Number,
    },
    methods: {
      cellClick() {
        // console.log(this.icon, this.w, this.h);
        this.icon = "dice-one";
        this.$emit('cell-click', this.w, this.h);
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
</style>