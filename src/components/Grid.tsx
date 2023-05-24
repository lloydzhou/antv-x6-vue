// @ts-nocheck
import { Grid as _Grid } from '@antv/x6'
import { defineComponent, onMounted, onUnmounted, watch, DefineComponent } from 'vue';
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

export const Grid: DefineComponent<_Grid.Options> = defineComponent({
  name: 'Grid',
  inject: [contextSymbol],
  setup(_, {attrs}) {
    const { graph } = useContext()
    const draw = () => {
      const options = mergeOption(defaultOptions, {...attrs})
      graph.hideGrid()
      graph.drawGrid(options)
    }
    watch(() => attrs, () => draw(), {deep: true})
    onMounted(() => draw())
    onUnmounted(() => graph.clearGrid())
    return () => null
  }
})

