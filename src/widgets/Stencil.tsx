// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch, nextTick, shallowReactive, provide, inject } from 'vue';
import { Addon, FunctionExt } from '@antv/x6'
import { useContext, contextSymbol, createContext } from '../GraphContext'
import { mergeOption } from '../utils'
const { Stencil } = Addon

export const stencilContextSymbol = String(Symbol('x6StencilContextSymbol'))
export const StencilGroup = defineComponent({
  name: 'StencilGroup',
  props: ['name', 'title', 'collapsed', 'collapsable', 'graphWidth', 'graphHeight', 'graphPadding', 'graphOptions', 'layout', 'layoutOptions'],
  inject: [stencilContextSymbol],
  setup(props, { slots }) {
    const { stencil } = inject(stencilContextSymbol)

    /** createContext内的数据 */
    const contextRef = shallowReactive({
      graph: null,
    });

    createContext(contextRef); 

    const reset = FunctionExt.debounce(() => {
      // 调用loadGroup，重置一下
      // 防止子组件循环注册的时候，多次调用
      stencil.value.loadGroup(contextRef.graph.getNodes(), props.name)
    }, 200)
    onMounted(() => {
      nextTick(() => {
        contextRef.graph = stencil.value.getGraph(props.name)
        const model = stencil.value.getModel(props.name)
        model.on('node:added', reset)
      })
    })
    return () => <div>{contextRef.graph && slots.default ? slots.default({ stencil }) : null}</div>
  }
})

// 使用默认值
const defaultOptions = Stencil.defaultOptions

export default defineComponent({
  name: 'Stencil',
  props: [
    'target', 'scaled', 'delegateGraphOptions', 'animation', 'containerParent', 'getDragNode', 'getDropNode', 'validateNode',
    'title', 'groups', 'search', 'placeholder', 'notFoundText', 'collapsable', 'stencilGraphWidth', 'stencilGraphHeight', 'stencilGraphOptions', 'stencilGraphPadding', 'layout', 'layoutOptions',
    'container',
  ],
  inject: [contextSymbol],
  setup(props, { slots }) {
    const { graph } = useContext()
    const defaultContainer = ref()
    const stencil = ref()
    const contextRef = shallowReactive({
      stencil,
    })

    provide(stencilContextSymbol, contextRef)

    onMounted(() => {
      const options = {
        ...props,
        target: graph,
      }
      // debounce的时候，实际运行传递的参数是之前传递进来的
      // 运行的时候，重新从props等参数再生成一遍，使用最新的
      stencil.value = new Stencil(mergeOption(defaultOptions, options));
      // 挂载节点
      (props.container ? props.container.value || props.container : defaultContainer.value).appendChild(stencil.value.container)
    })
    onUnmounted(() => {
      if (stencil.value) {
        stencil.value.onRemove()
      }
    })
    // 如果没有group的时候
    return () => (
      <div ref={node => defaultContainer.value = node}>
        {slots.default ? slots.default({ stencil }) : null}
      </div>
    )
  }
})


