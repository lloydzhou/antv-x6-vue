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

## Components
- [x] 提供`Graph`容器以及`GraphContext.useContext`获取`x6`的`graph`对象。可以利用这个对象操作画布，绑定事件。
- [x] 包装`Shape`作为`vue`组件＋使用`x6-vue-shape`封装自定义组件，暴露的组件有：

类 | shape 名称| 描述
-- | -- | --
Node | rect | 等同于Shape.Rect
Edge | edge | 等同于Shape.Edge
VueShape | vue-shape | 使用`@antv/x6-vue`渲染的自定义`vue`组件的容器，可以将`slots.default`内容渲染到节点内。
Shape.Rect | rect | 矩形。
Shape.Circle | circle | 圆形。
Shape.Ellipse | ellipse | 椭圆。
Shape.Polygon | polygon | 多边形。
Shape.Polyline | polyline | 折线。
Shape.Path | path | 路径。
Shape.Image | image | 图片。
Shape.HTML | html | HTML 节点，使用 foreignObject 渲染 HTML 片段。
Shape.TextBlock | text-block | 文本节点，使用 foreignObject 渲染文本。
Shape.BorderedImage | image-bordered | 带边框的图片。
Shape.EmbeddedImage | image-embedded | 内嵌入矩形的图片。
Shape.InscribedImage | image-inscribed | 内嵌入椭圆的图片。
Shape.Cylinder | cylinder | 圆柱。
Shape.Edge | edge | 边。
Shape.DoubleEdge | double-edge | 双线边。
Shape.ShadowEdge | shadow-edge | 阴影边。

**另外提供帮助函数**
名称| 描述
 -- | --
useCell | 使用这个函数可以通过传递markup之类的参数自定义节点
useVueShape | 使用这个函数自定义vue的渲染内容定制更加复杂的节点
useCellEvent | 通过这个函数绑定事件到cell上面

- [x] 提供内置的一些组件

名称| 描述
 -- | --
Grid | 渲染网格
Background | 渲染背景
Scroller | 滚动组件
Clipboard | 剪贴板，配合`Keyboard`组件可以使用`ctrl+c`/`ctrl+x`/`ctrl+v`
Keyboard | 键盘快捷键
MouseWheel | 鼠标滚轮，支持使用滚轮实现画布放大缩小

- [x] Widgets

名称| 描述
 -- | --
Snapline | 对齐线
Selection | 点选/框选
MiniMap | 小地图
Stencil | 内置的带分组和搜索功能的拖拽组件，还提供`StencilGroup`以实现分组功能

## TODO
- [ ] Stencil支持默认分组（不使用`StencilGroup`的情况）
- [ ] Dnd也作为组件实现
- [ ] ContextMenu：实现一个默认的menu，同时暴露一个useContextMenu方便用户定制


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

![image](https://user-images.githubusercontent.com/1826685/164883742-d114eaac-9751-4373-aa37-0c2e2971e14b.png)


