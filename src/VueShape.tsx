// @ts-nocheck
import { h, defineComponent, onMounted, markRaw, reactive } from 'vue';
import { VueShape as VueShapeContainer } from '@antv/x6-vue-shape';
import { contextSymbol, useContext } from './GraphContext'
import { NodeProps, useCell } from './Shape'
import { cellContextSymbol } from './GraphContext'
import { useTeleport, defaultViewId } from 'antv-x6-vue-teleport-view'
// import { useTeleport, defaultViewId } from './teleport'

export const TeleportContainer = defineComponent({
  name: 'TeleportContainer',
  props: {
    view: {
      type: String,
      default: () => defaultViewId
    }
  },
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const Teleport = useTeleport(props.view)
    return () => h(Teleport)
  }
})

export const VueShapeProps = NodeProps.concat('primer', 'useForeignObject', 'component')

export const useVueShape = (props, { slots, emit }) => {

  // 这里实际上只是在这个作用域传递一个createShape函数到useCell
  return useCell(props, {slots, emit}, (props) => {
    const {
      id,
      width, height,
      x, y,
      angle,
      primer='circle', useForeignObject=true, component,  // 这几个是@antv/x6-vue-shape独有的参数
      magnet,
      ...otherOptions
    } = props
    const cell = new VueShapeContainer({
      id,
      width: Number(width) || 60,
      height: Number(height) || 60,
      x: Number(x) || 0,
      y: Number(y) || 0,
      angle: Number(angle) || 0,
      primer, useForeignObject,
      // 这里将自己的slots中的内容强行放到画布中去
      // 这样图结构的交互还有一些操作逻辑交给x6
      // 通过vue绘制的组件渲染和组件内部交互逻辑交给用户
      component: component
        ? component
        : () => h('div', {key: id, class: 'vue-shape'}, slots.default ? slots.default({props, item: cell}) : null),
      ...otherOptions,
      view: props.view || defaultViewId,
    })
    return cell
  })
}

export const VueShape = defineComponent({
  name: 'VueShape',
  props: VueShapeProps,
  inject: [contextSymbol, cellContextSymbol],
  setup(props, context) {
    const cell = useVueShape(props, context)
    // 渲染名字是port的slot
    const { port } = context.slots
    return () => cell.value ? port && port(): null
  }
})

export default VueShape
