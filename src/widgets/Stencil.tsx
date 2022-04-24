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
    const { groups=[], stencil } = inject(stencilContextSymbol)

    /** createContext内的数据 */
    const contextRef = shallowReactive({
      graph: null,
    });

    createContext(contextRef); 

    const reset = FunctionExt.debounce(() => {
      // 调用loadGroup，重置一下
      // 防止子组件循环注册的时候，多次调用
      stencil.value.loadGroup(contextRef.graph.getNodes(), props.name)
    }, 20)
    watch(() => stencil.value, (stencil) => {
      contextRef.graph = stencil.getGraph(props.name)
      const model = stencil.getModel(props.name)
      model.on('node:added', reset)
    })
    onMounted(() => {
      groups.push({...props})
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
      groups: props.groups || [],
      stencil,
    })
    const init = FunctionExt.debounce((groups) => {
      if (stencil.value) {
        stencil.value.onRemove()
      }
      stencil.value = new Stencil(mergeOption(defaultOptions, {...props, groups, target: graph}));
      // 挂载节点
      (props.container ? props.container.value || props.container : defaultContainer.value).appendChild(stencil.value.container)
    }, 20)

    // 监听groups变化，如果这个变化，就覆盖contextRef.groups。这个逻辑估计不会执行，通常会被子组件注册的
    watch(() => props.groups, (groups) => contextRef.groups = groups)
    // 监听contextRef.groups变化
    watch(() => ({...props, groups: contextRef.groups}), init, {deep: 1})
    provide(stencilContextSymbol, contextRef)
    onMounted(() => {
      nextTick(() => {
        // nexttick能拿到下一层级注册进来的group列表
        init(contextRef.groups)
      })
    })
    onUnmounted(() => {
      stencil.value.onRemove()
    })
    return () => (
      <div ref={node => defaultContainer.value = node}>
        {slots.default ? slots.default({ stencil }) : null}
      </div>
    )
  }
})


