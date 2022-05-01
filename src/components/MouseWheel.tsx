// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  modifiers: 'ctrl',
}

export default defineComponent({
  name: 'MouseWheel',
  props: ['enabled', 'global', 'factor', 'zoomAtMousePosition', 'modifiers', 'guard'],
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const create = () => {
      graph.disableMouseWheel()
      const { enabled, ...otherOptions } = props
      const mousewheel = mergeOption(
        graph.options.mousewheel || {},
        mergeOption(
          defaultOptions,
          {
            ...otherOptions,
            enabled: enabled !== false
          }
        )
      )
      graph.options.mousewheel = mousewheel
      graph.enableMouseWheel()
    }
    watch(() => props, () => create(), {deep: true})
    onMounted(() => create())
    onUnmounted(() => graph.disableMouseWheel())
    return () => null
  }
})

