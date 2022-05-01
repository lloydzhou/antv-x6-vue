// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
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
  name: 'Grid',
  props: ['type', 'args', 'visible', 'size'],
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const draw = () => {
      // console.log('draw Grid', props)
      const options = mergeOption(defaultOptions, {...props})
      graph.hideGrid()
      graph.drawGrid(options)
    }
    watch(() => props, () => draw(), {deep: true})
    onMounted(() => draw())
    onUnmounted(() => graph.clearGrid())
    return () => null
  }
})

