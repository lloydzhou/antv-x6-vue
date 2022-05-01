// @ts-nocheck
import Graph from './Graph'
import * as GraphContext from './GraphContext'
import Shape, { Node, Rect, Edge, Cell, NodeProps, EdgeProps, useCell, useCellEvent } from './Shape'
import VueShape, { useVueShape, VueShapeProps, TeleportContainer } from './VueShape'
import Port, { PortGroup } from './Port'
import Grid from './components/Grid'
import Background from './components/Background'
import Clipboard from './components/Clipboard'
import Scroller from './components/Scroller'
import Keyboard from './components/Keyboard'
import MouseWheel from './components/MouseWheel'
import Connecting from './components/Connecting'


import Widgets from './widgets'
const { Snapline, Selection, MiniMap, Stencil, StencilGroup, ContextMenu, useContextMenu } = Widgets


const components = [
  Graph,
  ...Object.values(Shape), // 这里将Shape这个里面所有的组件都注册一下
  TeleportContainer,
  VueShape,
  Port, PortGroup,
  Grid,
  Background,
  Clipboard,
  Scroller,
  Keyboard,
  MouseWheel,
  Connecting,
  Snapline,
  Selection,
  MiniMap,
  StencilGroup, Stencil,
  ContextMenu,
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(`X6${component.name}`, component);
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  Graph,
  Shape,
  Node,
  Rect,
  Edge,
  Cell, useCell, useCellEvent, NodeProps, EdgeProps,
  TeleportContainer,
  VueShape, useVueShape, VueShapeProps,
  Grid,
  Background,
  Clipboard,
  Selection,
  Scroller,
  Keyboard,
  MouseWheel,
  Connecting,
  GraphContext,
  Widgets,
  MiniMap,
  Snapline,
  Stencil, StencilGroup,
  ContextMenu, useContextMenu,
  Port, PortGroup,
  install,
}

Graph.install = install

export default Graph

