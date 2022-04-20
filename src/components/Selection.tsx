// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  multiple: true,
  rubberband: true,
  showNodeSelectionBox: true,
  modifiers: 'shift',
}

export default defineComponent({
  name: 'Selection',
  props: ['enabled', 'multiple', 'rubberband', 'rubberNode', 'rubberEdge', 'strict', 'modifiers', 'movable', 'content', 'filter'],
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const clear = () => {
      graph.cleanSelection()
      graph.disableSelection()
    }
    const create = () => {
      // 1. 先停止监听
      clear()
      // 2. 重新生成对应的widget（由于manager在graph上是readonly的只能更改内层的widget）
      const { enabled, ...otherOptions } = props
      const selecting = mergeOption(
        graph.selection.widgetOptions || {},
        mergeOption(
          defaultOptions,
          {
            ...otherOptions,
            enabled: enabled !== false
          }
        )
      )
      graph.options.selecting = selecting
      graph.selection.widget = graph.hook.createSelection()
      graph.enableSelection()
      graph.selection.enable()
    }
    watch(() => props, () => create(), {deep: true})
    onMounted(() => create())
    onUnmounted(() => clear())
    return () => null
  }
})

