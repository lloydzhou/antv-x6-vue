// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  size: 10,
  visible: true,
  type: 'dot',
  args: {
    color: '#a0a0a0',
    thickness: 1,
  }
}

export default defineComponent({
  name: 'Snapline',
  props: ['className', 'tolerance', 'sharp', 'resizing', 'filter'],
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const draw = () => {
      // const options = mergeOption(defaultOptions, {...props})
      graph.hideSnapline()
      graph.enableSnapline()
    }
    watch(() => props, () => draw(), {deep: true})
    onMounted(() => draw())
    onUnmounted(() => graph.clearGrid())
    return () => null
  }
})

