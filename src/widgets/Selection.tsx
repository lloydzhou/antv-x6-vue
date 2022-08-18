// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
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
  setup(props, { emit }) {
    const { graph } = useContext()

    const selected = (e) => emit('selected', e)
    const unselected = (e) => emit('unselected', e)
    const changed = (e) => emit('changed', e)

    const clear = () => {
      graph.cleanSelection()
      graph.disableSelection()
      graph.off('cell:selected', selected)
      graph.off('cell:unselected', unselected)
      graph.off('selection:changed', changed)
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
      // 从那边获取的值是{0: 'ctrl', 1: 'meta'}不是一个Array
      if (selecting.multiple && !selecting.multipleSelectionModifiers.length) {
        selecting.multipleSelectionModifiers = ['ctrl', 'meta']
      }
      graph.options.selecting = selecting
      graph.selection.widget = graph.hook.createSelection()
      graph.enableSelection()
      graph.selection.enable()
      graph.on('cell:selected', selected)
      graph.on('cell:unselected', unselected)
      graph.on('selection:changed', changed)
    }
    watch(() => props, () => create(), {deep: true})
    onMounted(() => create())
    onUnmounted(() => clear())
    return () => null
  }
})

