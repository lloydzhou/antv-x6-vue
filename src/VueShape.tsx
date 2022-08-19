// @ts-nocheck
import { h, defineComponent, onMounted, markRaw, reactive } from 'vue';
import { VueShape as VueShapeContainer, useTeleport } from '@antv/x6-vue-shape';
import { contextSymbol, useContext } from './GraphContext'
import { NodeProps, useCell } from './Shape'
import { cellContextSymbol } from './GraphContext'
const defaultViewId = 'antv-x6-vue-teleport-view'

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
  const {
    id, primer='circle', useForeignObject=true, component,  // 这几个是@antv/x6-vue-shape独有的参数
  } = props
  const cell = useCell({
    id,
    primer, useForeignObject,
    // 这里将自己的slots中的内容强行放到画布中去
    // 这样图结构的交互还有一些操作逻辑交给x6
    // 通过vue绘制的组件渲染和组件内部交互逻辑交给用户
    view: defaultViewId,
    ...props,
    shape: 'vue-shape',
    component: component
      ? component
      : () => h('div', {key: id, class: 'vue-shape'}, slots.default ? slots.default({props, item: cell.value}) : null),
  }, {slots, emit})
  return cell
}

export const VueShape = defineComponent({
  name: 'VueShape',
  props: VueShapeProps,
  inject: [contextSymbol, cellContextSymbol],
  setup(props, context) {
    const cell = useVueShape(props, context)
    const { default: _default, port } = context.slots
    // port和default都有可能需要渲染
    // 配置component的时候，VueShape节点使用props.component渲染，这个时候，需要渲染default
    return () => cell.value ? <Fragment>
      {port && port()}
      {!!props.component && _default && _default()}
    </Fragment> : null
  }
})

export default VueShape
