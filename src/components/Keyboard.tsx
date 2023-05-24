// @ts-nocheck
import { Keyboard as _Keyboard } from '@antv/x6'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'

const defaultOptions = {
  global: true,
}

export const Keyboard: DefineComponent<Keyboard.Options> = defineComponent({
  name: 'Keyboard',
  inject: [contextSymbol],
  setup(_, {attrs}) {
    const { graph } = useContext()
    const update = () => {
      // console.log('draw KEYBOARD', props)
      // TODO 暂时不能更新参数
      graph.disableKeyboard()
      graph.enableKeyboard()
    }
    watch(() => attrs, () => update(), {deep: true})
    onMounted(() => update())
    onUnmounted(() => graph.disableKeyboard())
    return () => null
  }
})

