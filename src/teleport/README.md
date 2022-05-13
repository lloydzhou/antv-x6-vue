# antv-x6-vue-teleport-view

**注意**  
当前项目代码已经合并到@antv/x6-vue-shape的1.4.0版本。
https://github.com/antvis/X6/pull/2078


优化`x6-vue-shape`默认创建多个App导致渲染性能问题。同时避免出现节点数据更新不及时问题。

> 默认的`x6-vue-shape`把每一个节点渲染成一个vue的app导致渲染性能问题
> 通过vue3提供的Teleport功能，让当前App的子组件渲染到foreignobject内部。解决性能问题的同时，也能更好的处理VueShape组件内部数据及时更新的问题

参考这个issue，使用默认的vue-shape-view的时候会生成一大堆的vue app，使用useTeleport注册新的view后，只会有一个vue app
https://github.com/lloydzhou/antv-x6-vue/issues/10


## 思路

1. 直接注册一个View，这个View会绑定一个动态的TeleportContainer返回出去。
2. View在初始化的时候，会把对应cell传进来的Component挂到TeleportContainer上面去。
3. new VueShape的时候指定相同的viewId
4. 最后挂载TeleportContainer


## DEMO
https://codesandbox.io/s/vue-shape-forked-0b5ijb?file=/src/App.vue


```
import { useTeleport, defaultViewId } from "antv-x6-vue-teleport-view";

// 使用viewid注册一个新的view
const TeleportContainer = useTeleport(defaultViewId);

// 生成vue-shape的节点的时候，指定对应的view
graph.addNode({
  id: "1",
  shape: "vue-shape",
  view: defaultViewId,
  x: 200,
  y: 150,
  width: 150,
  height: 100,
  component: "count",
  data: {
    num: 0,
  },
});
```


