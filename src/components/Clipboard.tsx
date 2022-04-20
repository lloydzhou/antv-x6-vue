// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'

export default defineComponent({
  name: 'Clipboard',
  props: ['enabled'],
  inject: [contextSymbol],
  setup(props) {
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
      }
    }
    const paste = () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
    }
    onMounted(() => {
      enableClipboard()
      graph.bindKey('ctrl+c', copy)
      graph.bindKey('ctrl+v', paste)
    })
    onUnmounted(() => {
      graph.disableClipboard()
      graph.unbindKey('ctrl+c', copy)
      graph.unbindKey('ctrl+v', paste)
    })
    return () => null
  }
})

