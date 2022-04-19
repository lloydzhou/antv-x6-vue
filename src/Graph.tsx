// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch, toRaw, toRef, markRaw, shallowReactive, Fragment } from 'vue';

import * as X6 from '@antv/x6'
import {createContext} from './GraphContext'
import clone from '@antv/util/es/clone'
import './index.less'

const Graph = defineComponent({
  name: 'Graph',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    layout: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: Number,
      default: () => 600
    },
    width: {
      type: Number,
      default: () => 800
    },
  },
  setup(props, {slots}) {
    const { data, layout, width, height, ...otherOptions } = props;
    const self = markRaw({
      props,
      data,
      graph: {},
      height: Number(height),
      width: Number(width),
      layout: {},
      options: { ...otherOptions },
      isReady: false
    })

    // self.props不会同步变化
    watch(() => props, (newProps) => self.props = {...newProps})

    /** Graph的DOM */
    const graphDOM = ref<HTMLDivElement | null>(null);

    /** createContext内的数据 */
    const contextRef = shallowReactive({
      graph: {},
      layout: {},
    });

    createContext(contextRef);
    
    const initGraphInstance = () => {
      const {
        data,
        layout,
        width,
        height,
        autoResize,
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
        autoResize: autoResize !== false,
        ...otherOptions,
      })

      self.graph = new X6.Graph(self.options)
      contextRef.graph = self.graph
      self.isReady = true
    }
    onMounted(() => {
      initGraphInstance()
    })

    return {
      graphDOM,
      isReady: toRef(self, 'isReady')
    }
  },
  render() {
    const { graphDOM, isReady, $slots: slots } = this
    return (
      <div id="graph-contaner">
        <div data-testid="custom-element" class="graph-core" ref="graphDOM">
          {isReady && <Fragment>
            {slots.default ? slots.default() : null}
            {slots.components ? slots.components() : null}
          </Fragment>}
        </div>
      </div>
    )
  }
})

export default Graph
