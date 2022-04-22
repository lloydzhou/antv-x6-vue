<template>
  <Graph>
    <Node id="1" :x="100" :y="100" />
    <Node id="2" :x="200" :y="200" />
    <Edge id="e1" source="1" target="2" />
    <VueShape primer="rect" id="3" :x="200" :y="300" :width="160" :attrs="{rect: {fill: '#ddd', stroke: '#333'}}" label="VueShape">
      <div>这里是一个vue的组件</div>
    </VueShape>
    <Edge id="e2" source="1" target="3" />
    <!-- <Scroller /> -->
    <Background />
    <Grid :visible="showGrid" />
    <Snapline />
    <Selection />
    <Clipboard />
    <Keyboard />
    <MouseWheel />
    <!-- <MiniMap /> -->
  </Graph>
</template>

<script lang="ts">
// @ts-nocheck
import { Options, Vue } from 'vue-class-component';
import Graph, { Node, Edge, VueShape } from './index'
import { Grid, Background, Clipboard, Snapline, Selection, Keyboard, Scroller, MouseWheel, MiniMap } from './index'

import { test } from './history.test'
test()

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
    Scroller,
    Keyboard,
    MouseWheel,
    MiniMap,
    VueShape,
  },
})
export default class App extends Vue {

  showGrid = true
  showScroller = true

  created() {
    setTimeout(() => {
      // this.showGrid = false
      // this.showScroller= false
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
