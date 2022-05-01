// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import { useContext, contextSymbol } from '../GraphContext'

const defaultOptions = {
  global: true,
}

export default defineComponent({
  name: 'Keyboard',
  props: ['enabled', 'global', 'format', 'guard'],
  inject: [contextSymbol],
  setup(props) {
    const { graph } = useContext()
    const update = () => {
      // console.log('draw KEYBOARD', props)
      // TODO 暂时不能更新参数
      graph.disableKeyboard()
      graph.enableKeyboard()
    }
    watch(() => props, () => update(), {deep: true})
    onMounted(() => update())
    onUnmounted(() => graph.disableKeyboard())
    return () => null
  }
})

