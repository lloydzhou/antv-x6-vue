// @ts-nocheck
import Graph from './Graph'
import * as GraphContext from './GraphContext'
import Shape, { Node, Rect, Edge, Cell, useCell } from './Shape'
import VueShape, { useVueShape, VueShapeProps } from './VueShape'
import Grid from './components/Grid'
import Background from './components/Background'
import Clipboard from './components/Clipboard'
import Snapline from './components/Snapline'
import Selection from './components/Selection'
import Scroller from './components/Scroller'
import Keyboard from './components/Keyboard'
import MouseWheel from './components/MouseWheel'
import MiniMap from './components/MiniMap'


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
  Cell,
  useCell,
  VueShape, useVueShape, VueShapeProps,
  Grid,
  Background,
  Clipboard,
  Snapline,
  Selection,
  Scroller,
  Keyboard,
  MouseWheel,
  MiniMap,
  GraphContext,
}

export default Graph

