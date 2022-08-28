// @ts-nocheck
import { defineComponent, onMounted, ref, watch, watchEffect, markRaw, shallowReactive, Fragment, provide } from 'vue';
import * as X6 from '@antv/x6'
import { createContext, cellContextSymbol } from './GraphContext'
// import clone from '@antv/util/es/clone'
import { addListener, removeListener } from 'resize-detector'
import { debounce } from './utils'


export const GraphProps = [
  'width', 'height', 'autoResize', 'panning',
  'grid', 'background', 'snapline', 'scroller', 'minimap', 'history', 'clipboard', 'keyboard', 'mousewheel', 'selecting',
  'rotating', 'resizing', 'translating', 'transforming', 'embedding', 'connecting', 'highlighting', 'interacting', 'sorting',
  'async', 'frozen', 'checkView', 'magnetThreshold', 'moveThreshold', 'clickThreshold',
  'preventDefaultContextMenu', 'preventDefaultBlankAction',
  'guard', 'allowRubberband', 'allowPanning',
  'getCellView', 'createCellView', 'getHTMLComponent',
  'onPortRendered', 'onEdgeLabelRendered', 'onToolItemCreated', 'model',
]

const Graph = defineComponent({
  name: 'Graph',
  props: GraphProps,
  setup(props, { emit }) {
    const { width, height, ...otherOptions } = props;
    const self = markRaw({
      props,
      graph: {},
      height: Number(height),
      width: Number(width),
      layout: {},
      options: { ...otherOptions },
    })
    const isReady = ref(false)

    // self.props不会同步变化
    watch(() => props, (newProps) => self.props = {...newProps})

    /** Graph的DOM */
    const graphDOM = ref<HTMLDivElement | null>(null);

    /** createContext内的数据 */
    const contextRef = shallowReactive({
      graph: {},
    });

    createContext(contextRef);
    // 避免injection not found警告
    provide(cellContextSymbol, { cell: null })
    
    const initGraphInstance = () => {
      const {
        width,
        height,
        autoResize,
        panning,
        ...otherOptions
      } = props;
      /**  width and height */
      const { clientWidth, clientHeight } = graphDOM.value as HTMLDivElement;
      /** 重新计算宽度 */
      self.width = Number(width) || clientWidth || 500;
      self.height = Number(height) || clientHeight || 500;

      self.options = markRaw({
        container: graphDOM.value,
        width: self.width,
        height: self.height,
        // autoResize: autoResize !== false,
        panning: panning !== false,
        ...otherOptions,
      })

      self.graph = new X6.Graph(self.options)
      contextRef.graph = self.graph
      isReady.value = true
      emit('ready', { graph: self.graph })
    }

    // autoresize
    watchEffect((cleanup) => {
      const resizeListener = debounce((e) => {
        const { width, height } = e.getBoundingClientRect()
        if (self.graph) {
          self.graph.resize(width, height)
        }
      })
      if (props.autoResize !== false && graphDOM.value) {
        const root = graphDOM.value.parentNode
        resizeListener(root)
        addListener(root, resizeListener)
        cleanup(() => {
          removeListener(root, resizeListener)
        })
      }
    })

    onMounted(() => {
      initGraphInstance()
    })

    return {
      graphDOM,
      isReady,
    }
  },
  render() {
    const { isReady, $slots: slots } = this
    return (
      <div id="graph-contaner" style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}>
        <div data-testid="custom-element" class="graph-core" style={{
          width: '100%',
          height: '100%',
        }} ref="graphDOM" />
        <div class="graph-component">
          {isReady && <Fragment>
            {slots.default ? slots.default() : null}
            {slots.components ? slots.components() : null}
          </Fragment>}
        </div>
      </div>
    )
  },
})
export default Graph
