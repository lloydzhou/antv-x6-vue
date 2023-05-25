// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch, watchEffect, provide, shallowReactive, inject, Fragment } from 'vue';
import { Node as X6Node, Edge as X6Edge, Shape, Cell as BaseShape, ObjectExt } from '@antv/x6'
import { useContext, contextSymbol } from './GraphContext'
import { cellContextSymbol, portGroupContextSymbol } from './GraphContext'
import { processProps, bindEvent } from './utils'

const createCell = (p) => {
  const { props, events } = processProps(p)
  const { id, shape, x, y, width, height, angle, ...otherOptions } = props
  // 从registry获取注册的类型，获取不到就使用Cell
  const ShapeClass = X6Node.registry.get(shape) || X6Edge.registry.get(shape) || BaseShape
  return new ShapeClass({
    id, shape,
    width: Number(width) || 160,
    height: Number(height) || 40,
    x: Number(x) || 0,
    y: Number(y) || 0,
    angle: Number(angle) || 0,
    ...otherOptions
  })
}

export const useCell = (props) => {
  // 这里如果传入的不是function就包裹一层
  const { graph } = useContext()
  const cell = ref()

  const context = shallowReactive({ cell: null })
  provide(cellContextSymbol, context)
  const parent = inject(cellContextSymbol)
  // 避免injection not found警告
  provide(portGroupContextSymbol, { name: '' })

  // 监听其他变化
  watch(() => props, newProps => {
    const newCell = createCell(newProps)
    const prop = newCell.getProp()
    if (!ObjectExt.isEqual(cell.value.getProp(), prop)) {
      Object.keys(prop).forEach((key) => {
        if (['id', 'parent', 'shape'].indexOf(key) === -1) {
          cell.value.setProp(key, prop[key])
        }
      })
    }
  })
  const removeEvent = ref()
  onMounted(() => {
    // 从registry获取注册的类型，获取不到就使用Cell
    cell.value = createCell(props)
    if (props.magnet === false || props.magnet === true) {
      cell.value.setAttrByPath(`${props.primer || cell.value.shape}/magnet`, !!props.magnet)
    }
    const { events } = processProps(props)
    removeEvent.value = bindEvent(cell.value, events, graph)
    // 共享给子组件
    context.cell = cell.value
    // 当前节点添加到子节点
    if (parent && parent.cell) {
      parent.cell.addChild(cell.value)
    }
    graph.addCell(cell.value)
  })
  onUnmounted(() => {
    // 当前节点从子节点移除
    if (parent && parent.cell) {
      // cell.value.removeFromParent()
      parent.cell.removeChild(cell.value)
    }
    graph.removeCell(cell.value)
    if (removeEvent.value) {
      removeEvent.value()
    }
  })

  return cell
}

const Cell = defineComponent({
  name: 'Cell',
  inheritAttrs: false,
  inject: [contextSymbol, cellContextSymbol],
  setup(_, { slots, attrs: props }) {
    const cell = useCell(props)
    // 优先判断名字是port的slot在不在，不存在的时候渲染默认的slot
    const { default: _default, port } = slots
    return () => cell.value ? <Fragment>
      {port && port()}
      {_default && _default()}
    </Fragment> : null
  }
})

const Shapes = {}

Object.keys(Shape).forEach(name => {
  const ShapeClass = Shape[name]
  Shapes[name] = defineComponent({
    inheritAttrs: false,
    name,
    inject: [contextSymbol, cellContextSymbol],
    setup(_, { attrs: props, slots }) {
      const { shape: defaultShape } = ShapeClass.defaults || {}
      const { shape=defaultShape } = props
      const cell = useCell({...props, shape})
      const { default: _default, port } = slots
      // port和default都有可能需要渲染
      return () => cell.value ? <Fragment>
        {port && port()}
        {_default && _default()}
      </Fragment> : null
    }
  })
})

const { Rect, Edge } = Shapes
const Node = Rect
Node.name = 'Node'
export {
  Shape,
  Cell,
  Node,
  Rect,
  Edge,
}
export default Shapes


