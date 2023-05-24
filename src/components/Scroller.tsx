// @ts-nocheck
import { Scroller as _Scroller } from '@antv/x6'
import { defineComponent, onMounted, onUnmounted, watch, DefineComponent } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  pannable: true,
  autoResize: true,
}

export const Scroller: DefineComponent<_Scroller.Options> = defineComponent({
  name: 'Scroller',
  inject: [contextSymbol],
  setup(_, {attrs}) {
    const { graph } = useContext()
    const clear = () => {
      if (graph.scroller.widget) {
        graph.scroller.widget.dispose()
      }
    }
    const create = () => {
      // 1. 先停止监听
      clear()
      // 2. 重新生成对应的widget（由于manager在graph上是readonly的只能更改内层的widget）
      const { enabled, ...otherOptions } = attrs
      const scroller = mergeOption(
        graph.options.scroller || {},
        mergeOption(
          defaultOptions,
          {
            ...otherOptions,
            enabled: enabled !== false
          }
        )
      )
      graph.options.scroller = scroller
      graph.scroller.widget = graph.hook.createScroller()
      graph.drawGrid(graph.options.grid)
    }
    watch(() => attrs, () => create(), {deep: true})
    onMounted(() => create())
    onUnmounted(() => clear())
    return () => null
  }
})

