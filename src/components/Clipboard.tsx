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
      if (enabled) {
        graph.enableClipboard()
      }
    }
    watch(() => props.enabled, (enabled) => enableClipboard(enabled))
    onMounted(() => enableClipboard())
    onUnmounted(() => graph.disableClipboard())
    return () => null
  }
})

