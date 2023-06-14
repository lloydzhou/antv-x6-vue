// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watchEffect, shallowRef } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'
import { Selection } from "@antv/x6-plugin-selection";

const defaultOptions = {
  multiple: true,
  rubberband: true,
  showNodeSelectionBox: true,
  modifiers: 'shift',
}

export default defineComponent({
  name: 'Selection',
  inheritAttrs: false,
  inject: [contextSymbol],
  emits: ["selected", "unselected", "changed"],
  setup(_, { attrs: props, emit }) {
    const { graph } = useContext()

    const plugin = shallowRef<typeof Selection>()
    watchEffect((cleanup) => {
      plugin.value = new Selection(mergeOption(defaultOptions, {...props}))
      graph.use(plugin.value)
      cleanup(() => {
        if (plugin.value) {
          plugin.value.dispose()
        }
      })
    })

    const selected = (e) => emit('selected', e)
    const unselected = (e) => emit('unselected', e)
    const changed = (e) => emit('changed', e)

    onMounted(() => {
      graph.on('cell:selected', selected)
      graph.on('cell:unselected', unselected)
      graph.on('selection:changed', changed)
    })
    onUnmounted(() => {
      graph.off('cell:selected', selected)
      graph.off('cell:unselected', unselected)
      graph.off('selection:changed', changed)
    })
    return () => null
  }
})

