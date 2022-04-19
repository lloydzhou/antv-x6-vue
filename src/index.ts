// @ts-nocheck
import Graph from './Graph'
import Cell, { Node, Edge } from './Cell'

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
  Cell,
  Node,
  Edge,
}

export * as X6 from '@antv/x6'


export default Graph

