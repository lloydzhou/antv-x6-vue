<template>
  <div class="container">
    <div ref="stencil" class="stencil"/>
    <Graph>
      <Node id="1" :x="100" :y="100" @added="added" label="node1" />
      <Node id="2" :x="200" :y="200" label="node2" />
      <Edge id="e1" source="1" target="2" @added="added" label="edge1" />
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
      <Selection @selected="selected" @unselected="unselected" @changed="changed" />
      <Snapline />
      <Clipboard @copy="copy" @paste="paste" />
      <Keyboard />
      <MouseWheel />
      <MiniMap />
      <Stencil :container="stencil" :layoutOptions="{columns: 1, columnWidth: 200, rowHeight: 60}" :stencilGraphWidth="200" :validateNode="validateNode">
        <StencilGroup name="group1" :graphHeight="160" :graphWidth="200">
          <Node id="1" @added="added" label="group node1" :width="160" />
          <Node id="2" label="group node2" :width="160" />
        </StencilGroup>
        <StencilGroup name="group2" :graphHeight="200" :graphWidth="200">
          <Node id="3" label="group2 node3" :width="160" />
          <Node id="4" label="group2 node4" :width="160" />
        </StencilGroup>
      </Stencil>
      <Node v-for="node in addedNodes" :key="node.id" v-bind="node" />
      <ContextMenu>
        <template #default="scope">
          <Menu @click="hendleContextMenuClick(scope, $event)">
            <MenuItem key="1">Item 1</MenuItem>
            <MenuItem key="2">Item 2</MenuItem>
          </Menu>
        </template>
      </ContextMenu>
    </Graph>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, ref } from 'vue'
import { Options, Vue } from 'vue-class-component';
import Graph, { Node, Edge, VueShape, useVueShape, VueShapeProps, GraphContext, useCellEvent } from './index'
import { Grid, Background, Clipboard, Snapline, Selection, Keyboard, Scroller, MouseWheel, MiniMap } from './index'
import { Stencil, StencilGroup } from './index'
import { ContextMenu } from './index'
import { Menu } from 'ant-design-vue'
import 'ant-design-vue/es/menu/style/css'

const { contextSymbol } = GraphContext
const MenuItem = Menu.Item

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
    Stencil,
    StencilGroup,
    ContextMenu, Menu, MenuItem,
  },
})
export default class App extends Vue {

  showGrid = true
  showScroller = true
  visible = true
  y = 0
  stencil = ref()

  addedNodes = []

  created() {
    setTimeout(() => {
      // this.showGrid = false
      // this.showScroller= false
      // this.visible = false
      this.y = 400
    }, 5000)
  }
  copy(e) {
    console.log('copy', e)
  }
  paste(e) {
    console.log('paste', e)
  }
  added(e) {
    console.log('added', e)
  }
  click(e) {
    console.log('click', e)
  }
  selected(e) {
    console.log('selected', e)
  }
  unselected(e) {
    console.log('unselected', e)
  }
  changed(e) {
    console.log('changed', e)
  }
  validateNode(node, options) {
    console.log('validateNode', node, options)
    const label = node.getLabel()
    const { width, height } = node.getSize()
    const { x, y } = node.getPosition()
    this.addedNodes.push({
      id: `add_node_${this.addedNodes.length}`,
      label,
      x,
      y,
      width,
      height,
    })
    // 这里将数据存到当前对象，永远返回false，拖拽的节点不放入画布，使用一个新的节点替换位置
    return Promise.resolve(false)
  }
  hendleContextMenuClick(data, e) {
    console.log('hendleContextMenuClick', data, e)
    data.onClose()
  }
}
</script>

<style lang="less">
.container{
  display: flex;
  height: 99vh;
  .stencil{
    width: 280px;
    height: 100%;
    position: relative;
  }
  #graph-contaner{
    flex: 1;
  }
}
</style>
