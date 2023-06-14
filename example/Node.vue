<template>
  <div :class="`node ${data.status}`">
    <img alt="" :src="image.logo" />
    <span className="label">{{ data.label }}</span>
    <span className="status">
      <img v-if="data.status === 'success'" alt="" :src="image.success" />
      <img v-if="data.status === 'failed'" alt="" :src="image.failed" />
      <img v-if="data.status === 'running'" alt="" :src="image.running" />
    </span>
  </div>
</template>

<script>
import { defineComponent, watchEffect, toRef, toRefs } from "vue";

export const image = {
  logo:
    "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ",
  success:
    "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ",
  failed:
    "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ",
  running:
    "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ",
};

export default defineComponent({
  name: "AlgoNode",
  props: {
    graph: {
      type: Object,
      default: () => ({}),
    },
    node: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    // const { graph, node, data = {} } = props;
    // const state = toRef(data);
    // const { label, status } = state;
    watchEffect(() => {
      const { graph, node, data = {} } = props;
      console.log("graph data", data);
      const edges = graph.getIncomingEdges(node);
      (edges || []).forEach((edge) => {
        if (data.status === "running") {
          edge.attr("line/strokeDasharray", 5);
          edge.attr("line/style/animation", "running-line 30s infinite linear");
        } else {
          edge.attr("line/strokeDasharray", "");
          edge.attr("line/style/animation", "");
        }
      });
    });
    return {
      // ...toRefs(props.data),
      image,
    };
  },
});
</script>

