// @ts-nocheck
import { MiniMap } from "@antv/x6-plugin-minimap";
import { defineComponent, watchEffect, shallowRef } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


const defaultOptions = {
  enabled: true,
  width: 160,
  height: 120,
  padding: 10,
  scalable: false,
  minScale: 0.01,
  maxScale: 16,
  graphOptions: null,
}

export default defineComponent({
  name: 'MiniMap',
  inheritAttrs: false,
  inject: [contextSymbol],
  setup(_, { attrs: props }) {
    const { graph } = useContext()
    const containerRef = shallowRef()
    
    const plugin = shallowRef<typeof MiniMap>()
    watchEffect((cleanup) => {
      if (containerRef.value) {
        plugin.value = new MiniMap(mergeOption({
          ...defaultOptions,
          graphOptions: { background: graph.options.background, grid: graph.options.grid },
        }, {
          ...props,
          enabled: props.enabled !== false,
          container: containerRef.value,
        }))
        graph.use(plugin.value)
      }
      cleanup(() => {
        if (plugin.value) {
          plugin.value.dispose()
        }
      })
    })

    return () => {
      const { style = {} } = props
      return <div ref={node => containerRef.value = node} style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'transparent',
        boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
        ...style
      }} />
    }
  }
})
