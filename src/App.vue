<template>
  <Graph>
    <Node id="1" :x="100" :y="100" />
    <Node id="2" :x="200" :y="200" />
    <Edge id="e1" source="1" target="2" />
    <Grid :visible="showGrid" />
    <Background />
    <Snapline />
    <Selection />
    <Clipboard />
  </Graph>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Graph, { Node, Edge } from './index'
import { Grid, Background, Clipboard, Snapline, Selection } from './index'


@Options({
  components: {
    Graph,
    Node,
    Edge,
    Grid,
    Background,
    Clipboard,
    Snapline,
    Selection,
  },
})
export default class App extends Vue {

  showGrid = true

  created() {
    setTimeout(() => {
      this.showGrid = false
    }, 5000)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
