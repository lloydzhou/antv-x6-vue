// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch, provide, shallowReactive, inject, Fragment } from 'vue';
import { Node as X6Node, Edge as X6Edge, Shape, Cell as BaseShape } from '@antv/x6'
import { useContext, contextSymbol } from './GraphContext'
import { cellContextSymbol, portGroupContextSymbol } from './GraphContext'

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
  onUnmounted(() => clear())
  // 将取消监听的函数返回，用户可以主动取消
  return clear
}

export const useCell = (props, { emit }) => {
  // 这里如果传入的不是function就包裹一层
  const getProps = typeof props == 'function' ? props : () => props
  const { graph } = useContext()
  const cell = ref()

  const context = shallowReactive({ cell: null })
  provide(cellContextSymbol, context)
  const parent = inject(cellContextSymbol)
  // 避免injection not found警告
  provide(portGroupContextSymbol, { name: '' })

  const added = (e) => emit('added', e)
  const removed = (e) => emit('removed', e)

  // 监听其他变化
  useWatchProps(cell, getProps)
  // 默认给组件绑定一个监听change:*的回调
  useCellEvent('cell:change:*', ({ key, ...ev }) => emit(`cell:change:${key}`, ev), { cell })

  onMounted(() => {
    const props = getProps()
    const { id, shape, x, y, width, height, angle, ...otherOptions } = props
    // 从registry获取注册的类型，获取不到就使用Cell
    const ShapeClass = X6Node.registry.get(shape) || X6Edge.registry.get(shape) || BaseShape
    cell.value = new ShapeClass({
      id, shape,
      width: Number(width) || 160,
      height: Number(height) || 40,
      x: Number(x) || 0,
      y: Number(y) || 0,
      angle: Number(angle) || 0,
      ...otherOptions
    })
    if (props.magnet === false || props.magnet === true) {
      cell.value.setAttrByPath(`${props.primer || cell.value.shape}/magnet`, !!props.magnet)
    }
    cell.value.once('added', added)
    cell.value.once('removed', removed)
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
  })

  return cell
}

export const CellProps = ['id', 'markup', 'attrs', 'shape', 'view', 'zIndex', 'visible', 'data', 'parent']
export const EdgeProps = CellProps.concat('source', 'target', 'vertices', 'router', 'connector', 'labels', 'defaultLabel')
export const NodeProps = CellProps.concat('x', 'y', 'width', 'height', 'angle', 'ports', 'label', 'magnet')

export const useWatchProps = (cell, getProps) => {
  // 数值类型的转换后可能是NAN和MIN比较一下校验合法性
  const MIN = -1e20
  watch(() => getProps().markup, markup => markup && cell.value.setMarkup(markup), { deep: true })
  watch(() => getProps().attrs, attrs => attrs && cell.value.setAttrs(attrs), { deep: true })
  watch(() => Number(getProps().zIndex), zIndex => zIndex >= MIN && cell.value.setZIndex(zIndex))
  watch(() => getProps().visible, visible => (visible === false || visible === true) && cell.value.setVisible(visible))
  watch(() => getProps().data, data => data && cell.value.setData(data), { deep: true })
  watch(() => getProps().parent, p => p && cell.value.setProp('parent', p))

  watch(() => getProps().source, source => source && cell.value.setSource(typeof source === 'string' ? {cell: source} : source), { deep: true })
  watch(() => getProps().target, target => target && cell.value.setTarget(typeof target === 'string' ? {cell: target} : target), { deep: true })
  watch(() => getProps().vertices, vertices => vertices && cell.value.setVertices(vertices), { deep: true })
  watch(() => getProps().router, router => router && cell.value.setRouter(router), { deep: true })
  watch(() => getProps().connector, connector => connector && cell.value.setConnector(connector), { deep: true })
  watch(() => getProps().labels, labels => labels && cell.value.setLabels(labels), { deep: true })

  watch(() => [Number(getProps().x), Number(getProps().y)], position => {
    const [x, y] = position
    const pposition = cell.value.getProp('position')
    cell.value.setProp('position', {
      x: x > MIN ? x : pposition.x,
      y: y > MIN ? y : pposition.y,
    })
  })
  watch(() => [Number(getProps().width), Number(getProps().height)], size => {
    const [width, height] = size
    const psize = cell.value.getProp('size')
    cell.value.setProp('size', {
      width: width > MIN ? width : psize.width,
      height: height > MIN ? height : psize.height,
    })
  })
  watch(() => Number(getProps().angle), angle => angle > MIN && cell.value.rotate(angle, {absolute: true}))
  watch(() => getProps().label, label => label && cell.value.setProp('label', label))
  // 增加配置是否可以连线
  watch(() => getProps().magnet, magnet => {
    if (magnet === false || magnet === true) {
      cell.value.setAttrByPath(`${getProps().primer || cell.value.shape}/magnet`, !!magnet)
    }
  })
}

const Cell = defineComponent({
  name: 'Cell',
  props: CellProps,
  inject: [contextSymbol, cellContextSymbol],
  setup(props, context) {
    const cell = useCell(props, context)
    // 优先判断名字是port的slot在不在，不存在的时候渲染默认的slot
    const { default: _default, port } = context.slots
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
    name,
    props: /Edge/.test(name) ? EdgeProps : NodeProps,
    inject: [contextSymbol, cellContextSymbol],
    setup(props, context) {
      const { shape: defaultShape } = ShapeClass.defaults || {}
      const { shape=defaultShape } = props
      const cell = useCell({...props, shape}, context)
      const { default: _default, port } = context.slots
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


