// @ts-nocheck
import { h, defineComponent, shallowReactive, onMounted, markRaw, nextTick, watch } from 'vue';
import { NodeProps, useCell } from './Shape'
import { contextSymbol, cellContextSymbol } from './GraphContext'
import 'antv-x6-html2'
import { wrap } from './Teleport'

export const VueShapeProps = NodeProps.concat('primer', 'useForeignObject', 'component')

export const useVueShape = (props, { slots, emit }) => {
  const {
    id, primer='circle', useForeignObject=true, component,  // 这几个是@antv/x6-vue-shape独有的参数
  } = props
  const Component = markRaw(component ? component : () => h('div', {key: id, class: 'vue-shape'}, slots.default ? slots.default({props, item: cell.value}) : null))

  const DataWatcher = defineComponent({
    name: 'DataWatcher',
    props: ['graph', 'node', 'container'],
    setup(props) {
      const { node, graph, container } = props
      // console.log('DataWatcher', node, props)
      const state = shallowReactive({ data: node.getData() })
      const size = shallowReactive(node.size())
      onMounted(() => {
        node.on('change:data', () => {
          state.data = node.getData()
        })
      })
      watch(() => size, (size) => {
        console.log('watch size', size)
        node.size(size)
      })
      return () => {
        if (typeof container.firstChild.getBoundingClientRect === 'function') {
          const { width, height } = container.firstChild.getBoundingClientRect()
          console.log('watchEffect', {width, height}, size, node)
          nextTick(() => {
            size.width = width
            size.height = height
            node.size({width, height}, { silent: true })
          })
        }
        return h(Component, {...props, data: state.data})
      }
    }
  })
  
  const cell = useCell({
    id,
    primer, useForeignObject,
    ...props,
    shape: 'html2',
    html: markRaw(wrap(DataWatcher)),
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
