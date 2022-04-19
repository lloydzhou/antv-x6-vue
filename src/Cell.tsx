// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch, toRaw, toRef, markRaw, shallowReactive, Fragment } from 'vue';

import * as X6 from '@antv/x6'
import { useContext, contextSymbol } from './GraphContext'


const Cell = defineComponent({
  name: 'Cell',
  props: {
    id: {
      type: String,
      default: () => ''
    }
  },
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const { id, shape, ...otherOptions } = props

    // shape变化
    watch(() => shape, (shape) => {
      graph.removeCell(id)
      graph.addCell(new X6.Cell({id, shape, ...otherOptions}))
    })
    // 监听其他变化
    watch(() => otherOptions, (options) => {
      const { markup, attrs, zIndex, visible, data } = options
      Object.keys(options).forEach(key => cell.setProp(key, options[key]))
      // [markup, attrs, zIndex, visible, data].filter(i => i).forEach(prop => cell.setProp(prop))
    })
    onMounted(() => {
      graph.addCell(new X6.Cell({id, shape, ...otherOptions}))
    })
    onUnmounted(() => {
      graph.removeCell(id)
    })
    return () => null
  }
})

// export const Node = defineComponent({
//   name: 'Node',
//   props: {
//     id: {
//       type: String,
//       default: () => ''
//     }
//   },
//   render() {
//     const {id, shape='rect', otherOptions} = this
//     return <Cell id={id} shape={shape} {...otherOptions} />
//   }
// })

export const Node = (props) => {
  const {id, shape='rect', otherOptions} = props
  return <Cell id={id} shape={shape} {...otherOptions} />
}
export const Edge = (props) => {
  const {id, shape='edge', otherOptions} = props
  return <Cell id={id} shape={shape} {...otherOptions} />
}

export default Cell


