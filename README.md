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
    // 直接传递props给useVueShape，watch的时候不能监听到变化
    const cell = useVueShape(() => props, context)
    useCellEvent('node:click', (e) => context.emit('click', e), { cell })
    return () => null
  }
})
```
5. 提供`useTeleport`，优化`x6-vue-shape`默认创建多个App导致渲染性能问题。同时避免出现节点数据更新不及时问题。

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
VueShape | vue-shape | 使用`@antv/x6-vue-shape`渲染的自定义`vue`组件的容器，可以将`slots.default`内容渲染到节点内。
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

- [x] 抽象连接桩为组件使用

名称| 描述
 -- | --
PortGroup | 提供`ports/groups/<group_name>`相关的配置，同时也作为Port组件的容器，提供一个默认的group名称
Port | 调用addPort/removePort操作当前连接桩，比x6官方多提供一个magnet参数（默认情况需要使用`attrs/circle/magnet`进行配置）。另外，Port也可以独立使用。

> 使用Port和PortGroup的时候，可以放在一个以`port`命名的slot里面（考虑到默认的VueShape会将默认的slot认为是用户自定义的节点，这里使用slots.port区分一下），也可以直接使用默认的slot

```
<Node id="1" :x="100" :y="100" label="node1">
  <PortGroup name="in" position="top" :attrs="{circle: {r: 6, magnet: true, stroke: '#31d0c6'}}">
    <Port id="id1" />
    <Port id="id2" :magnet="false" />
  </PortGroup>
</Node>
<Node id="2" :x="200" :y="200" label="node2">
  <Port id="id1" />
</Node>
```

- [x] 提供内置的一些组件

名称| 描述
 -- | --
Grid | 渲染网格
Background | 渲染背景
Scroller | 滚动组件
Clipboard | 剪贴板，配合`Keyboard`组件可以使用`ctrl+c`/`ctrl+x`/`ctrl+v`
Keyboard | 键盘快捷键
MouseWheel | 鼠标滚轮，支持使用滚轮实现画布放大缩小
Connecting | 配置连线相关参数和帮助方法

- [x] Widgets

名称| 描述
 -- | --
Snapline | 对齐线
Selection | 点选/框选
MiniMap | 小地图
Stencil | 内置的带分组和搜索功能的拖拽组件，还提供`StencilGroup`以实现分组功能
Contextmenu | 右键菜单
TeleportContainer | 一个默认和useVueShape绑定到同一个view的容器，使用这个组件的时候，可以不用手动调用useTeleport，也不用专门指定view

## TODO
- [ ] Stencil支持默认分组（不使用`StencilGroup`的情况）
- [ ] Dnd也作为组件实现
- [x] ContextMenu：实现一个默认的menu，同时暴露一个useContextMenu方便用户定制
- [x] 实现Connecting，也作为组件使用
- [x] 提供PluginInstallFunction，支持全局注册组件（组件有`x6-`或者`X6`前缀，例如`X6Node`,`x6-node`都会对应前面提到的`Node`组件）
```
<x6-node id="44" :x="400" :y="300" label="node4">
  <x6-port-group name="in" position="top" :attrs="{circle: {r: 6, magnet: true, stroke: '#31d0c6'}}">
    <x6-port id="id1" />
  </x6-port-group>
</x6-node>
```

- [x] 支持群组功能。UI嵌套的时候自动调用embed和unembed函数处理父子关系
```
<Node id="9" :x="500" :y="200" label="node9" :width="300" :height="200">
  <Node id="99" :x="550" :y="220" label="node99" :width="200" :height="150">
    <Node id="999" :x="580" :y="240" label="node999"></Node>
  </Node>
</Node>
```

- [x] 使用Teleport渲染
> 默认的`x6-vue-shape`把每一个节点渲染成一个vue的app导致渲染性能问题
> 通过vue3提供的Teleport功能，让当前App的子组件渲染到foreignobject内部。解决性能问题的同时，也能更好的处理VueShape组件内部数据及时更新的问题


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

![image](https://user-images.githubusercontent.com/1826685/165353091-0f5a009d-fad6-4137-bd44-219bf0b872a3.png)



