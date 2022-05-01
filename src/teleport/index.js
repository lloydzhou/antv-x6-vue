// @ts-nocheck
import { h, defineComponent, Teleport, reactive, markRaw } from 'vue';
import { NodeView } from '@antv/x6'
export const defaultViewId = 'vue-shape-teleport-view'

export const useTeleport = (uniqViewId = defaultViewId) => {
  const action = 'vue'
  const items = reactive({})

  const connect = (id, node, graph, component, getContainer) => {
    items[id] = markRaw(defineComponent({
      render: () =>  getContainer() ? h(Teleport, {to: getContainer()}, h(component)) : null,
      provide: () => ({
        getGraph: () => graph,
        getNode: () => node,
      })
    }))
  }
  const disconnect = (id) => {
    delete items[id]
  }

  const TeleportContainer = defineComponent({
    name: 'TeleportContainer',
    setup() {
      return () =>
        h(
          "div",
          { style: "display: none;" },
          Object.keys(items).map((id) => h(items[id]))
        );
    }
  })

  class VuePortalShapeView extends NodeView {
    init() {
      super.init()
      const targetId = `${this.graph.view.cid}:${this.cell.id}`
      this.cell.on('removed', () => {
        disconnect(targetId)
      })
      const component = this.graph.hook.getVueComponent(this.cell)
      // console.log('connect', targetId, this.cell, this.graph)
      // 这里需要将当前View的cell以及graph还有component等对象存储起来给TeleportContainer使用
      connect(targetId, this.cell, this.graph, component, this.getComponentContainer.bind(this))
    }
    getComponentContainer() {
      return this.cell.prop('useForeignObject') === false
        ? (this.selectors.content)
        : (this.selectors.foContent)
    }
    confirmUpdate(flag) {
      const ret = super.confirmUpdate(flag)
      return this.handleAction(ret, action, () => {
        // 这里无需做任何处理，但是，没有这个函数的时候，会卡死...
      })
    }
  }
  VuePortalShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    }
  })

  NodeView.registry.register(uniqViewId, VuePortalShapeView, true)

  return TeleportContainer
}

export default useTeleport

