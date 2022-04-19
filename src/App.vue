<template>
  <Graph>
    <Node id="1"></Node>
    <Node id="2" />
    <Edge id="e1" source="1" target="2" />
    <Cell id="4" shape="rect" />
    <Cell id="5" shape="rect" />
    <Cell id="6" shape="edge" source="4" target="5" />
  </Graph>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Graph, { Node, Edge, Cell } from './index'


@Options({
  components: {
    Graph,
    Node,
    Edge,
    Cell,
  },
})
export default class App extends Vue {
  
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
