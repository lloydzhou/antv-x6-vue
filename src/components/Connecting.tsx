// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watch, ref } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  snap: { radius: 40 },
  dangling: true,
  allowMulti: true,
  allowBlank: true,

  allowLoop: true,
  allowNode: true,
  allowEdge: false,
  allowPort: true,
  highlight: false,

  anchor: 'center',
  edgeAnchor: 'ratio',
  connectionPoint: 'boundary',
  strategy: null,
  router: 'normal',
  connector: 'normal',

  validateConnection: () => true,
  validateEdge: () => true,
}

export default defineComponent({
  name: 'Connecting',
  props: [...Object.keys(defaultOptions)],
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const options = ref()
    onMounted(() => {
      options.value = {...graph.options.connecting}
      const newOptions = mergeOption(defaultOptions, {...props, enabled: props.enabled !== false})
      mergeOption(newOptions, graph.options.connecting)
    })
    onUnmounted(() => {
      // 直接恢复之前的旧的配置
      mergeOption(options.value, graph.options.connecting)
    })
    return () => null
  }
})


