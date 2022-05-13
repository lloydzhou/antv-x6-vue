<template>
  <div class="container">
    <div ref="stencil" class="stencil"/>
    <Graph @ready="ready">
      <Node id="1" x="100" y="100" @added="added" label="node1">
        <PortGroup name="in" position="top" :attrs="{circle: {r: 6, magnet: true, stroke: '#31d0c6'}}">
          <Port id="id1" />
          <Port id="id2" :magnet="false" />
          <x6-port id="id3" />
        </PortGroup>
      </Node>
      <Node id="9" x="500" y="200" label="node9" :width="300" :height="200">
        <Node id="99" :x="550" :y="220" label="node99" :width="200" :height="150">
          <Node id="999" :x="580" :y="240" label="node999"></Node>
        </Node>
      </Node>
      <Node id="2" :x="200" :y="200" label="node2">
        <Port id="id1" :attrs="{circle: {r: 6, magnet: true, stroke: '#31d0c6'}}" />
      </Node>
      <x6-node id="44" :x="400" :y="300" label="node4">
        <x6-port-group name="in" position="top" :attrs="{circle: {r: 6, magnet: true, stroke: '#31d0c6'}}">
          <x6-port id="id1" />
        </x6-port-group>
      </x6-node>
      <Edge id="e1" source="1" target="2" @added="added" label="edge1" />
      <VueShape primer="rect" id="3" :x="200" :y="300" :width="160" :attrs="{rect: {fill: '#ddd', stroke: '#333'}, label: {text: 'VueShape'}}" @added="added" @cell:change:zIndex="changed">
        <div>这里是一个vue的组件</div>
        <img style="width: 30px;height:30px;" src="https://v3.cn.vuejs.org/logo.png" />
        <template #port>
        <PortGroup name="in" position="top" :attrs="{circle: {r: 6, magnet: true, stroke: '#31d0c6'}}">
          <Port id="id1" />
          <Port id="id2" :magnet="false" />
        </PortGroup>
        </template>
      </VueShape>
      <CustomNode v-if="visible" primer="circle" id="4" :x="400" :width="100" :height="100" :y="y" :attrs="{circle: {fill: '#ddd', stroke: '#333'}, label: {text: 'CustomNode'}}" @added="added" @click="click" @cell:change:position="changed" :magnet="true" >
        <span style="text-align: center;display: inline-block;width: 100%;margin-top: 20px;">Hello {{name}}</span>
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
      <Stencil :container="stencil" :layoutOptions="{columns: 1, columnWidth: 200, rowHeight: 60}" :stencilGraphWidth="200" :validateNode="validateNode" :groups="[{name: 'group1', graphHeight: 160}, {name: 'group2', graphHeight: 160}]">
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
      <ContextMenu bindType="edge" bindEvent="click">
        <template #default="scope">
          <Menu @click="hendleContextMenuClick(scope, $event)">
            <MenuItem key="1">edge Item 1</MenuItem>
            <MenuItem key="2">edge Item 2</MenuItem>
          </Menu>
        </template>
      </ContextMenu>
      <Connecting :validateEdge="validateEdge" />
      <TeleportContainer />
    </Graph>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, ref, h } from 'vue'
import { Options, Vue } from 'vue-class-component';
import { Port, PortGroup, TeleportContainer } from '../src/index'
import Graph, { Node, Edge, VueShape, useVueShape, VueShapeProps, GraphContext, useCellEvent } from '../src/index'
import { Grid, Background, Clipboard, Snapline, Selection, Keyboard, Scroller, MouseWheel, MiniMap } from '../src/index'
import { Stencil, StencilGroup } from '../src/index'
import { ContextMenu } from '../src/index'
import { Menu } from 'ant-design-vue'
import 'ant-design-vue/es/menu/style/css'
import { Connecting } from '../src/index'

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
    Connecting,
    MiniMap,
    VueShape,
    CustomNode,
    Stencil,
    StencilGroup,
    ContextMenu, Menu, MenuItem,
    Port, PortGroup,
    TeleportContainer,
  },
})
export default class App extends Vue {

  showGrid = true
  showScroller = true
  visible = true
  y = 0
  stencil = ref()
  name = "antv"

  addedNodes = []

  created() {
    setTimeout(() => {
      // this.showGrid = false
      // this.showScroller= false
      // this.visible = false
      this.y = 400
      this.name = 'x6'
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
      magnet: true, // 直接通过这个变量控制是否能连接
    })
    // 这里将数据存到当前对象，永远返回false，拖拽的节点不放入画布，使用一个新的节点替换位置
    return Promise.resolve(false)
  }
  hendleContextMenuClick(data, e) {
    console.log('hendleContextMenuClick', data, e)
    // data.onClose()
  }
  validateEdge({edge}) {
    console.log('validateEdge', edge)
    return true
  }
  ready({ graph }){
    // setGraph(graph)
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
