import { MouseWheel as _MouseWheel } from '@antv/x6'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  modifiers: 'ctrl',
}

export const MouseWheel: DefineComponent<MouseWheel.Options> = defineComponent({
  name: 'MouseWheel',
  inject: [contextSymbol],
  setup(_, { attrs }) {
    const { graph } = useContext()
    const create = () => {
      graph.disableMouseWheel()
      const { enabled, ...otherOptions } = attrs
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
    watch(() => attrs, () => create(), {deep: true})
    onMounted(() => create())
    onUnmounted(() => graph.disableMouseWheel())
    return () => null
  }
})

