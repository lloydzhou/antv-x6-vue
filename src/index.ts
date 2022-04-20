// @ts-nocheck
import Graph from './Graph'
import Shape, { Node, Rect, Edge, Cell } from './Shape'
import Grid from './components/Grid'
import Background from './components/Background'
import Clipboard from './components/Clipboard'
import Snapline from './components/Snapline'
import Selection from './components/Selection'
import Keyboard from './components/Keyboard'


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
  Grid,
  Background,
  Clipboard,
  Snapline,
  Selection,
  Keyboard,
}

export default Graph

