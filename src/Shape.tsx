// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch, provide, shallowReactive } from 'vue';

import { Shape, Cell as BaseShape } from '@antv/x6'
import { useContext, contextSymbol } from './GraphContext'

export const cellContextSymbol = String(Symbol('x6cellContextSymbol'))

export const useCellEvent = (name, handler, options={}) => {
  const { graph } = useContext()
  const { cell, once } = options

  const xhandler = (e) => {
    // 如果传了cell参数就使用cell_id判断一下触发事件的回调是不是对应到具体的元素上面
    const target = e.node || e.edge || e.cell || (e.view && e.view.cell)
    const target_id = target ? target.id : undefined
    const cell_id = cell ? cell.value ? cell.value.id : cell.id : undefined
    // console.log('xhandler', target_id, '===', cell_id, name, e)
    if (target_id) {
      if (target_id === cell_id) {
        // 如果事件是针对
        handler(e)
      }
    } else {
      handler(e)
    }
  }
  const clear = () => !once && graph.off(name, xhandler)
  onMounted(() => {
    if (once) {
      graph.once(name, xhandler)
    } else {
      graph.on(name, xhandler)
    }
  })
  onUnmounted(() => clear)
  // 将取消监听的函数返回，用户可以主动取消
  return clear
}

export const useCell = (props, { emit }, Shape=BaseShape) => {
  const { graph } = useContext()
  const { id, shape, magnet, ...otherOptions } = props
  if ('width' in otherOptions && otherOptions.width === undefined) {
    otherOptions.width = 80
  }
  if ('height' in otherOptions && otherOptions.height === undefined) {
    otherOptions.height = 40
  }
  const cell = ref()

  const context = shallowReactive({ cell: null })
  provide(cellContextSymbol, context)

  const added = (e) => emit('added', e)
  const removed = (e) => emit('removed', e)

  // 监听其他变化
  useWatchProps(cell, props)
  // 默认给组件绑定一个监听change:*的回调
  useCellEvent('cell:change:*', ({ key, ...ev }) => emit(`cell:change:${key}`, ev), { cell })

  onMounted(() => {
    cell.value = new Shape({id, shape, ...otherOptions})
    if (magnet === false || magnet === true) {
      cell.value.setAttrByPath(`${cell.value.shape}/magnet`, !!props.magnet)
    }
    cell.value.once('added', added)
    cell.value.once('removed', removed)
    // 共享给子组件
    context.cell = cell.value
    graph.addCell(cell.value)
  })
  onUnmounted(() => {
    graph.removeCell(id)
  })

  return cell
}

export const CellProps = ['id', 'markup', 'attrs', 'shape', 'view', 'zIndex', 'visible', 'data', 'parent']
export const EdgeProps = CellProps.concat('source', 'target', 'vertices', 'router', 'connector', 'labels', 'defaultLabel')
export const NodeProps = CellProps.concat('x', 'y', 'width', 'height', 'angle', 'ports', 'label', 'magnet')

export const useWatchProps = (cell, props) => {
  watch(() => props.markup, markup => cell.value.setMarkup(markup))
  watch(() => props.attrs, attrs => cell.value.setAttrs(attrs))
  watch(() => props.zIndex, zIndex => cell.value.setZIndex(zIndex))
  watch(() => props.visible, visible => cell.value.setVisible(visible))
  watch(() => props.data, data => cell.value.setData(data))
  watch(() => props.parent, p => cell.value.setParent(p))

  watch(() => props.source, source => cell.value.setSource(source))
  watch(() => props.target, target => cell.value.setTarget(target))
  watch(() => props.vertices, vertices => cell.value.setVertices(vertices))
  watch(() => props.router, router => cell.value.setRouter(router))
  watch(() => props.connector, connector => cell.value.setConnector(connector))
  watch(() => props.labels, labels => cell.value.setLabels(labels))

  watch(() => ({x: props.x, y: props.y}), position => cell.value.setPosition(position))
  watch(() => ({width: props.width, height: props.height}), size => cell.value.setSize(size))
  watch(() => props.angle, angle => cell.value.rotate(angle, {absolute: true}))
  // TODO ports 感觉还是自己手动处理更新逻辑？
  // 自己使用useCell，拿到cell.value，通过insertPort/removePort/setPortProp这几个方法处理
  watch(() => props.label, label => cell.value.setLabel(label))
  // 增加配置是否可以连线
  watch(() => props.magnet, magnet => (magnet === false || magnet === true) && cell.value.setAttrByPath(`${cell.value.shape}/magnet`, !!magnet))
}


const Cell = defineComponent({
  name: 'Cell',
  props: CellProps,
  inject: [contextSymbol],
  setup(props, context) {
    const cell = useCell(props, context, BaseShape)
    // 优先判断名字是port的slot在不在，不存在的时候渲染默认的slot
    const { default: _default, port } = context.slots
    return () => cell.value ? port ? port() : _default ? _default() : null : null;
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
      const cell = useCell({...props, shape}, context, ShapeClass)
      // 优先判断名字是port的slot在不在，不存在的时候渲染默认的slot
      const { default: _default, port } = context.slots
      return () => cell.value ? port ? port() : _default ? _default() : null : null;
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


