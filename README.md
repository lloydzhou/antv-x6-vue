# antv-x6-vue



```
import { defineComponent, reactive } from 'vue'
import Graph, { Node, Edge } from 'antv-x6-vue'


export default defineComponent({
  setup(props) {
    const state = reactive({
      nodes: [],
      edges: [],
    })
    return () => (
      <Graph>
        {nodes.map(node => <Node :key="node.id" :model="node" />)}
        {edges.map(edge => <Edge :key="edge.id" :model="edge" />)}
      </Graph>
    )
  }
})

```

