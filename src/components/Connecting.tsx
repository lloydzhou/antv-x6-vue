// @ts-nocheck
import { Options } from '@antv/x6'
import { defineComponent, onMounted, onUnmounted, ref, DefineComponent } from 'vue';
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

export const Connecting: DefineComponent<Options.Connecting> = defineComponent({
  name: 'Connecting',
  inject: [contextSymbol],
  setup(_, { attrs }) {
    const { graph } = useContext()
    const options = ref()
    onMounted(() => {
      const { enabled, ...other } = attrs
      options.value = {...graph.options.connecting}
      const newOptions = mergeOption(defaultOptions, {...other, enabled: enabled !== false})
      mergeOption(newOptions, graph.options.connecting)
    })
    onUnmounted(() => {
      // 直接恢复之前的旧的配置
      mergeOption(options.value, graph.options.connecting)
    })
    return () => null
  }
})


