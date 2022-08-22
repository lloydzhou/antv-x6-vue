// @ts-nocheck
import { h, defineComponent } from 'vue';
import { NodeProps, useCell } from './Shape'
import { contextSymbol, cellContextSymbol } from './GraphContext'
import 'antv-x6-html2'
import { wrap } from './Teleport'

export const VueShapeProps = NodeProps.concat('primer', 'useForeignObject', 'component')

export const useVueShape = (props, { slots, emit }) => {

  // 这里实际上只是在这个作用域传递一个createShape函数到useCell
  const {
    id, primer='circle', useForeignObject=true, component,  // 这几个是@antv/x6-vue-shape独有的参数
  } = props
  const Component = component ? component : () => h('div', {key: id, class: 'vue-shape'}, slots.default ? slots.default({props, item: cell.value}) : null)
  const cell = useCell({
    id,
    primer, useForeignObject,
    ...props,
    shape: 'html2',
    html: wrap(Component),
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
