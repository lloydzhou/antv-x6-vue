// @ts-nocheck
import { h, defineComponent, shallowReactive, onMounted, onUnmounted, markRaw, nextTick, watch, watchEffect, shallowRef, Fragment } from 'vue';
import { NodeProps, useCell } from './Shape'
import { contextSymbol, cellContextSymbol } from './GraphContext'
import 'antv-x6-html2'
import { wrap } from './Teleport'
import { addListener, removeListener } from "resize-detector";
import { debounce } from './utils'

export const VueShapeProps = NodeProps.concat('primer', 'useForeignObject', 'component', 'autoResize')

export const useVueShape = (props, { slots, emit }) => {

  // 兼容之间旧的数据
  const p = typeof props === 'function' ? props() : props
  const {
    id,
    autoResize=true,
    primer='circle', useForeignObject=true, component,  // 这几个是@antv/x6-vue-shape独有的参数
  } = p
  const Component = markRaw(component ? component : () => slots.default ? slots.default({props: p, item: cell.value}) : null)

  const DataWatcher = defineComponent({
    name: 'DataWatcher',
    props: ['graph', 'node', 'container'],
    setup(props) {
      const { node, graph, container } = props
      const state = shallowReactive({ data: node.getData() })
      const root = shallowRef()
      onMounted(() => {
        node.on('change:data', () => {
          state.data = node.getData()
        })
      })
      watchEffect((cleanup) => {
        const resizeListener = debounce((e) => {
          const { width, height } = getComputedStyle(e)
          // console.log('resizeListener', node.id, node.size(), {width, height})
          node.size({width: parseFloat(width), height: parseFloat(height)})
        })
        if (autoResize !== false && root.value) {
          // 开启minimap的时候，需要判断是哪一个view渲染的
          if (node.model && node.model.graph && node.model.graph.view.cid === graph.view.cid) {
            resizeListener(root.value)
            addListener(root.value, resizeListener)
            cleanup(() => {
              removeListener(root.value, resizeListener)
            })
          }
        }
      })

      return () => h(
        'div',
        {
          key: id,
          class: 'vue-shape',
          ref: n => root.value = n,
        },
        h(Component, {...props, data: state.data})
      );
    }
  })
  
  const cell = useCell(() => ({
    id,
    primer, useForeignObject,
    ...(typeof props === 'function' ? props() : props),
    shape: 'html2',
    html: markRaw(wrap(DataWatcher)),
  }), {slots, emit})
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
