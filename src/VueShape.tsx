// @ts-nocheck
import { h, defineComponent, shallowReactive, onMounted, markRaw, watchEffect, shallowRef, Fragment, watch } from 'vue';
import { ObjectExt } from '@antv/x6'
import { useCell, createCell } from './Shape'
import { contextSymbol, cellContextSymbol } from './GraphContext'
import { register } from 'x6-html-shape'
// import createRender from 'x6-html-shape/dist/teleport'
import { createRender } from './Teleport'
import { addListener, removeListener } from "resize-detector";
import { debounce } from './utils'


export const useVueShape = (props, { slots }) => {

  const {
    id,
    autoResize=true,
    primer='circle', useForeignObject=true, component,  // 这几个是@antv/x6-vue-shape独有的参数
  } = props
  const Component = markRaw(component ? component : () => slots.default ? slots.default({props, item: cell.value}) : null)

  const DataWatcher = defineComponent({
    name: 'DataWatcher',
    props: ['graph', 'node', 'container'],
    setup(props) {
      const { node, graph } = props
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

  
  const render = createRender(DataWatcher)
  const shape = 'v-shape-' + Math.random ().toString(36).slice(-8)
  register({shape, render})
  const cell = useCell({
    id,
    primer, useForeignObject,
    ...(typeof props === 'function' ? props() : props),
    shape,
    render,
  })
  return cell
}

export const VueShape = defineComponent({
  name: 'VueShape',
  inheritAttrs: false,
  inject: [contextSymbol, cellContextSymbol],
  setup(props, context) {
    const cell = useVueShape(context.attrs, context)
    // 监听其他变化 watch不能放到useCell内部
    watch(() => context.attrs, newProps => {
      const newCell = createCell(newProps)
      const prop = newCell.getProp()
      if (!ObjectExt.isEqual(cell.value.getProp(), prop)) {
        Object.keys(prop).forEach((key) => {
          if (['id', 'parent', 'shape'].indexOf(key) === -1) {
            cell.value.setProp(key, prop[key])
          }
        })
      }
    }, { deep: true })
    const { default: _default, port } = context.slots
    // port和default都有可能需要渲染
    // 配置component的时候，VueShape节点使用props.component渲染，这个时候，需要渲染default
    return () => cell.value ? <Fragment>
      {port && port()}
      {!!context.attrs.component && _default && _default()}
    </Fragment> : null
  }
})

export default VueShape
