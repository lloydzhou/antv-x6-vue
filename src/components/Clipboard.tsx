// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'

export default defineComponent({
  name: 'Clipboard',
  props: ['enabled'],
  inject: [contextSymbol],
  setup(props, { emit }) {
    const { graph } = useContext()
    const enableClipboard = (enabled) => {
      // console.log('draw Background', props)
      graph.disableClipboard()
      if (enabled !== false) {
        graph.enableClipboard()
      }
    }
    watch(() => props.enabled, (enabled) => enableClipboard(enabled))
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
      enableClipboard()
      graph.bindKey('ctrl+c', copy)
      graph.bindKey('ctrl+x', cut)
      graph.bindKey('ctrl+v', paste)
    })
    onUnmounted(() => {
      graph.disableClipboard()
      graph.unbindKey('ctrl+c')
      graph.unbindKey('ctrl+x')
      graph.unbindKey('ctrl+v')
    })
    return () => null
  }
})

