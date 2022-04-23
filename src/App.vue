<template>
  <Graph>
    <Node id="1" :x="100" :y="100" @added="added" />
    <Node id="2" :x="200" :y="200"/>
    <Edge id="e1" source="1" target="2" @added="added" />
    <VueShape primer="rect" id="3" :x="200" :y="300" :width="160" :attrs="{rect: {fill: '#ddd', stroke: '#333'}, label: {text: 'VueShape'}}" @added="added" @cell:change:zIndex="changed">
      <div>这里是一个vue的组件</div>
      <img style="width: 30px;height:30px;" src="https://v3.cn.vuejs.org/logo.png" />
    </VueShape>
    <CustomNode v-if="visible" primer="circle" id="4" :x="400" :y="y" :attrs="{circle: {fill: '#ddd', stroke: '#333'}, label: {text: 'CustomNode'}}" @added="added" @click="click" @cell:change:position="changed" >
      <span>Hello</span>
    </CustomNode>
    <Edge id="e2" source="1" target="3" @added="added" />
    <!-- <Scroller /> -->
    <Background />
    <Grid :visible="showGrid" />
    <Snapline />
    <Clipboard />
    <Keyboard />
    <MouseWheel />
    <!-- <MiniMap /> -->
  </Graph>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { Options, Vue } from 'vue-class-component';
import Graph, { Node, Edge, VueShape, useVueShape, VueShapeProps, GraphContext, useCellEvent } from './index'
import { Grid, Background, Clipboard, Snapline, Selection, Keyboard, Scroller, MouseWheel, MiniMap } from './index'

const { useContext, contextSymbol } = GraphContext

const CustomNode = defineComponent({
  name: 'CustomNode',
  props: [...VueShapeProps, 'otherOptions'],
  inject: [contextSymbol],
  setup(props, context) {
    const cell = useVueShape(props, context)
    useCellEvent('node:click', (e) => context.emit('click', e), { cell })
    return () => null
  }
})

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
    CustomNode,
  },
})
export default class App extends Vue {

  showGrid = true
  showScroller = true
  visible = true
  y = 0

  created() {
    setTimeout(() => {
      // this.showGrid = false
      // this.showScroller= false
      // this.visible = false
      this.y = 400
    }, 5000)
  }
  added(e) {
    console.log('added', e)
  }
  click(e) {
    console.log('click', e)
  }
  changed(e) {
    console.log('changed', e)
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
