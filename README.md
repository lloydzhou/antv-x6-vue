# antv-x6-vue



## DEMO

```
import { defineComponent, reactive } from 'vue'
import Graph, { Node, Edge } from 'antv-x6-vue'


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
    <Grid :visible="showGrid" />
    <Background />
  </Graph>
</template>

```

