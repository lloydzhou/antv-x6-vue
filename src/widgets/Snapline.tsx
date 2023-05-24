// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  tolerance: 10,
}

export default defineComponent({
  name: 'Snapline',
  props: ['enabled', 'className', 'tolerance', 'sharp', 'resizing', 'clean', 'filter'],
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const updateSnapline = () => {
      graph.disableSnapline()
      const options = mergeOption(defaultOptions, {...props, enabled: props.enabled !== false})
      mergeOption(options, graph.snapline.widget.options)
      graph.enableSnapline()
    }
    // watch(() => props, () => updateSnapline(), {deep: true})
    // onMounted(() => updateSnapline())
    // onUnmounted(() => graph.disableSnapline())
    return () => null
  }
})

