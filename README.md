# antv-x6-vue

## 核心思想
1. 由于x6主要面向编辑场景，所以对每一个节点有更多的交互逻辑。所以，将x6的Shape抽象成组件，每一个组件负责管理自己的生命周期。
2. 针对复杂的自定义图形，利用x6支持渲染vue组件[@antv/x6-vue-shape](https://www.npmjs.com/package/@antv/x6-vue-shape)的功能，同时利用slots将节点渲染交给当前组件，将图形相关逻辑交给x6。
```
import { VueShape as VueShapeContainer } from '@antv/x6-vue-shape';
const VueShape = defineComponent({
  name: 'VueShape',
  props: [...NodeProps, 'primer', 'useForeignObject', 'component'],
  inject: [contextSymbol],
  setup(props, { slots, emit }) {
    const { graph } = useContext()
    const {
      id,
      width=60, height=60,
      primer='circle', useForeignObject=true, component,  // 这几个是@antv/x6-vue-shape独有的参数
      ...otherOptions
    } = props
    const cell = ref()
    const create = () => {
      cell.value = new VueShapeContainer({
        id, width, height,
        primer, useForeignObject,
        // 这里将自己的slots中的内容强行放到画布中去
        // 这样图结构的交互还有一些操作逻辑交给x6
        // 通过vue绘制的组件渲染和组件内部交互逻辑交给用户
        component: component
          ? component
          : () => h('div', {key: id, class: 'vue-shape'}, slots.default ? slots.default({props, item: cell}) : null),
        ...otherOptions,
      })
      graph.addCell(cell.value)
    }
    // 监听其他变化
    watch(() => otherOptions, (options) => {
      Object.keys(options).filter(key => options[key] !== undefined).forEach((key) => {
        cell.value.setProp(key, options[key])
      })
    })
    onMounted(() =>create())
    onUnmounted(() => {
      graph.removeCell(id)
    })
    return () => null
  }
})

```

## 安装
```
antv-x6-vue
```

## DEMO

```
import { defineComponent, reactive } from 'vue'
import Graph, { Node, Edge, Grid, Background } from 'antv-x6-vue'


export default defineComponent({
  setup(props) {
    // ...
    const state = reactive({
      showGrid: true,
    })
    return { ...toRefs(state) }
  },
})

// template
<template>
  <Graph>
    <Node id="1" :x="100" :y="100" />
    <Node id="2" :x="200" :y="200" />
    <Edge id="e1" source="1" target="2" />
    <VueShape primer="rect" id="3" :x="200" :y="300" :width="160" :attrs="{rect: {fill: '#ddd', stroke: '#333'}, label: {text: 'VueShape'}}">
      <div>这里是一个vue的组件</div>
      <img style="width: 30px;height:30px;" src="https://v3.cn.vuejs.org/logo.png" />
    </VueShape>
    <Edge id="e2" source="1" target="3" />
    <Background />
    <Grid :visible="showGrid" />
    <Snapline />
    <Selection />
    <Clipboard />
  </Graph>
</template>

```

![image](https://user-images.githubusercontent.com/1826685/164745288-4badbaec-ab74-4136-bc13-986c91aef782.png)


