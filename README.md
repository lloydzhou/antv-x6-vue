# antv-x6-vue

## 核心思想
1. 由于[x6](https://www.npmjs.com/package/@antv/x6)主要面向编辑场景，所以对每一个节点有更多的交互逻辑。所以，将x6的Shape抽象成组件，每一个组件负责管理自己的生命周期。
2. 针对复杂的自定义图形，利用x6支持渲染vue组件[@antv/x6-vue-shape](https://www.npmjs.com/package/@antv/x6-vue-shape)的功能，同时利用slots将节点渲染交给当前组件，将图形相关逻辑交给x6。
```
import { VueShape as VueShapeContainer } from '@antv/x6-vue-shape';

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

```

![image](https://user-images.githubusercontent.com/1826685/164878557-0c1ef06e-4e82-4204-b6a8-9347c8fd351e.png)

3. 提供`useVueShape`，可以很容易的自定义一个vue组件定制出来的节点。
4. 提供`useCellEvent`，可以比较方便的给当前节点绑定事件。
```
const CustomNode = defineComponent({
  name: 'CustomNode',
  props: [...VueShapeProps, 'otherOptions'],
  inject: [contextSymbol],
  setup(props, context) {
    const cell = useVueShape(props, context)
    useCellEvent('node:click', (e) => context.emit('click', e), { cell })
    return () => null
  }
})
```

## 安装
```
yarn add antv-x6-vue
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
      y: 10,
      visible: true,
    })
    const methods = {
      added(e) {
        console.log('added', e)
      },
      click(e) {
        console.log('click', e)
      },
      changed(e) {
        console.log('changed', e)
      },
    }
    return { ...toRefs(state), ...methods }
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
    <CustomNode
      v-if="visible"
      primer="circle"
      id="4"
      :x="400" :y="y"
      :attrs="{circle: {fill: '#ddd', stroke: '#333'}, label: {text: 'CustomNode'}}"
      @added="added"
      @click="click"
      @cell:change:position="changed"
    >
      <span>Hello</span>
    </CustomNode>
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


