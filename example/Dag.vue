<template>
  <div className="App">
    <Graph
      :panning="{ enabled: true, eventTypes: ['leftMouseDown', 'mouseWheel'] }"
      :highlighting="highlighting"
      :connecting="connecting"
      :height="600"
    >
      <Grid />
      <Background />
      <MouseWheel
        modifiers="ctrl"
        :factor="1.1"
        :maxScale="1.5"
        :minScale="1.5"
      />
      <Clipboard />
      <!-- <Selection
        :multiple="true"
        :rubberEdge="true"
        :rubberNode="true"
        :modifiers='["shift"]'
        :rubberband="true"
      /> -->
      <Keyboard />
      <VueShape
        v-for="node in nodes"
        :id="node.id"
        :key="node.id"
        :autoResize="true"
        shape="dag-node"
        :ports="{ ...portConfig, items: node.ports }"
        :data="{ ...node.data }"
        :component="AlgoNode"
        :x="node.x"
        :y="node.y"
      />
      <Edge
        v-for="edge in edges"
        :key="edge.id"
        shape="dag-edge"
        :source="edge.source"
        :target="edge.target"
        :zIndex="edge.zIndex"
      />
    </Graph>
    <TeleportContainer />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, ref } from "vue";
import Graph, {
  Grid,
  Background,
  Clipboard,
  Selection,
  Keyboard,
  MouseWheel,
  Edge,
  VueShape,
  TeleportContainer,
} from "../src/index";
import "./x6";
import AlgoNode from "./Node.vue";
import { dagdata, statusList } from "./data";

// hotfix
// window.Fragment = Fragment;

export default defineComponent({
  name: "App",
  components: {
    Graph,
    Grid,
    Background,
    Clipboard,
    Selection,
    Keyboard,
    MouseWheel,
    Edge,
    VueShape,
    TeleportContainer,
  },
  setup(props) {
    const state = reactive({
      nodes: dagdata.filter((i) => i.shape === "dag-node"),
      edges: dagdata.filter((i) => i.shape === "dag-edge"),
    });
    const timer = ref();

    const showNodeStatus = () => {
      const status = statusList.shift();
      // console.log('showNodeStatus', status)
      if (!status) {
        clearInterval(timer.value);
        return;
      }
      status.forEach((item) => {
        const { id, status } = item;
        state.nodes = state.nodes.map((node) => {
          if (node.id === id) {
            node.data = { ...node.data, status };
          }
          return node;
        });
        console.log('nodes', state.nodes, state.nodes.map(i => i.data.status))
      });
    };

    onMounted(() => {
      showNodeStatus();
      timer.value = setInterval(showNodeStatus, 3000);
      return () => {
        clearInterval(timer.value);
      };
    });

    return {
      ...toRefs(state),
      AlgoNode,
      highlighting: {
        magnetAdsorbed: {
          name: "stroke",
          args: {
            attrs: {
              fill: "#fff",
              stroke: "#31d0c6",
              strokeWidth: 4,
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: "algo-connector",
        connectionPoint: "anchor",
        anchor: "center",
        validateMagnet({ magnet }) {
          return magnet.getAttribute("port-group") !== "top";
        },
        createEdge({ sourceCell }) {
          return sourceCell.model.graph.createEdge({
            shape: "dag-edge",
            attrs: {
              line: {
                strokeDasharray: "5 5",
              },
            },
            zIndex: -1,
          });
        },
      },
      portConfig: {
        groups: {
          top: {
            position: "top",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#C2C8D5",
                strokeWidth: 1,
                fill: "#fff",
              },
            },
          },
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#C2C8D5",
                strokeWidth: 1,
                fill: "#fff",
              },
            },
          },
        },
      },
    };
  },
});
</script>

<style>
* {
  box-sizing: content-box;
}
.App {
  font-family: sans-serif;
  text-align: center;
  height: 600px;
  min-height: 600px;
}
.node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 45px;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5f95ff;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
}
.node img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 104px;
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}
.node .status {
  flex-shrink: 0;
}
.node.success {
  border-left: 4px solid #52c41a;
}
.node.failed {
  border-left: 4px solid #ff4d4f;
}
.node.running .status img {
  animation: spin 1s linear infinite;
}
.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}
.x6-node-selected .node.success {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}
.x6-node-selected .node.failed {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
}
.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

