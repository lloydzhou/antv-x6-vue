// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watchEffect, shallowRef } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { Clipboard } from "@antv/x6-plugin-clipboard";

export default defineComponent({
  name: 'Clipboard',
  inheritAttrs: false,
  inject: [contextSymbol],
  emits: ["copy", "cut", "paste"],
  setup(_, { attrs: props, emit }) {
    const { graph } = useContext()
    const plugin = shallowRef<typeof Clipboard>()
    watchEffect((cleanup) => {
      plugin.value = new Clipboard(props)
      graph.use(plugin.value)
      cleanup(() => {
        if (plugin.value) {
          plugin.value.dispose()
        }
      })
    })

    const isKeyboardEnabled = () => graph.isKeyboardEnabled && graph.isKeyboardEnabled()

    const copy = () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
        emit('copy', { cells, graph })
      }
    }
    const cut = () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
        emit('cut', { cells, graph })
      }
    }
    const paste = () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
        emit('paste', { cells, graph })
      }
    }
    onMounted(() => {
      if (isKeyboardEnabled()) {
        graph.bindKey('ctrl+c', copy)
        graph.bindKey('ctrl+x', cut)
        graph.bindKey('ctrl+v', paste)
      }
    })
    onUnmounted(() => {
      if (isKeyboardEnabled()) {
        graph.unbindKey('ctrl+c')
        graph.unbindKey('ctrl+x')
        graph.unbindKey('ctrl+v')
      }
    })
    return () => null
  }
})

