// @ts-nocheck
import { Background as _Background } from '@antv/x6'
import { defineComponent, onMounted, onUnmounted, watch, DefineComponent } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  color: '#f5f5f5',
}

export type BackgroundOptions = _Background.Options & {enabled: boolean};

export const Background: DefineComponent<BackgroundOptions> = defineComponent<BackgroundOptions>({
  name: 'Background',
  inject: [contextSymbol],
  setup(_, { attrs }) {
    const { graph } = useContext()
    const draw = () => {
      // console.log('draw Background', props)
      const { enabled, ...other } = attrs
      const options = mergeOption(defaultOptions, {...other, enabled: enabled !== false})
      graph.clearBackground()
      graph.drawBackground(options)
    }
    watch(() => attrs, () => draw(), {deep: true})
    onMounted(() => draw())
    onUnmounted(() => graph.clearBackground())
    return () => null
  }
})

