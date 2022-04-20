// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  color: '#f5f5f5',
}

export default defineComponent({
  name: 'Background',
  props: ['enabled', 'color', 'image', 'position', 'size', 'repeat', 'opacity', 'quality', 'angle'],
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const draw = () => {
      // console.log('draw Background', props)
      const options = mergeOption(defaultOptions, {...props, enabled: props.enabled !== false})
      graph.clearBackground()
      graph.drawBackground(options)
    }
    watch(() => props, () => draw(), {deep: true})
    onMounted(() => draw())
    onUnmounted(() => graph.clearBackground())
    return () => null
  }
})

