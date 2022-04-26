// @ts-nocheck
import Graph from './Graph'
import * as GraphContext from './GraphContext'
import Shape, { Node, Rect, Edge, Cell, NodeProps, EdgeProps, useCell, useCellEvent } from './Shape'
import VueShape, { useVueShape, VueShapeProps } from './VueShape'
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
]
Graph.install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  Graph.install(window.Vue);
}

export {
  Graph,
  Shape,
  Node,
  Rect,
  Edge,
  Cell, useCell, useCellEvent, NodeProps, EdgeProps,
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
}

export default Graph

