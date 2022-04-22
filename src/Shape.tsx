// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';

import { Shape, Cell as BaseShape } from '@antv/x6'
import { useContext, contextSymbol } from './GraphContext'


export const useCell = (props, { emit }, Shape=BaseShape) => {
  const { graph } = useContext()
  const { id, shape, ...otherOptions } = props
  if ('width' in otherOptions && otherOptions.width === undefined) {
    otherOptions.width = 80
  }
  if ('height' in otherOptions && otherOptions.height === undefined) {
    otherOptions.height = 40
  }
  const cell = ref()

  const added = (e) => emit('added', e)
  const removed = (e) => emit('removed', e)
  const changed = (e) => emit('changed', e)

  // shape变化
  watch(() => shape, (shape) => {
    graph.removeCell(id)
    cell.value = new Shape({id, shape, ...otherOptions})
    graph.addCell(cell.value)
  })
  // 监听其他变化
  watch(() => otherOptions, (options) => {
    Object.keys(options).filter(key => options[key] !== undefined).forEach((key) => {
      cell.value.setProp(key, options[key])
    })
  })
  onMounted(() => {
    cell.value = new Shape({id, shape, ...otherOptions})
    cell.value.on('added', added)
    cell.value.on('removed', removed)
    cell.value.on('changed', changed)
    graph.addCell(cell.value)
  })
  onUnmounted(() => {
    cell.value.off('added', added)
    cell.value.off('changed', changed)
    graph.removeCell(id)
    cell.value.off('removed', removed)
  })
}

export const CellProps = ['id', 'markup', 'attrs', 'shape', 'view', 'zIndex', 'visible', 'data', 'parent']
export const EdgeProps = CellProps.concat('source', 'target', 'vertices', 'router', 'connector', 'labels', 'defaultLabel')
export const NodeProps = CellProps.concat('x', 'y', 'width', 'height', 'angle', 'ports', 'label')

const Cell = defineComponent({
  name: 'Cell',
  props: CellProps,
  inject: [contextSymbol],
  setup(props, context) {
    useCell(props, context, BaseShape)
    return () => null
  }
})

const Shapes = {}

Object.keys(Shape).forEach(name => {
  const ShapeClass = Shape[name]
  Shapes[name] = defineComponent({
    name,
    props: /Edge/.test(name) ? EdgeProps : NodeProps,
    inject: [contextSymbol],
    setup(props, context) {
      const { shape: defaultShape } = ShapeClass.defaults || {}
      const { shape=defaultShape } = props
      useCell({...props, shape}, context, ShapeClass)
      return () => null
    }
  })
})

const { Rect, Edge } = Shapes
const Node = Rect
export {
  Shape,
  Cell,
  Node,
  Rect,
  Edge,
}
export default Shapes


