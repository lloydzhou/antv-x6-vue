// @ts-nocheck
import { h, defineComponent, Teleport, reactive, onMounted } from 'vue';
import { NodeView } from '@antv/x6'
import { useContext } from './GraphContext'
export const defaultViewId = 'vue-teleport-shape-view'

export const useTeleport = (uniqViewId = defaultViewId) => {
  const action = 'vue'
  let graph = null
  const items = reactive({})

  const targetId = (id) => `${uniqViewId}-${id}`

  const connect = (id, component, node) => {
    items[id] = defineComponent({
      render: () =>  h(Teleport, {to: '#' + targetId(id)}, h(component)),
      provide: () => ({
        getGraph: () => graph,
        getNode: () => node,
      })
    })
  }
  const disconnect = (id) => {
    delete items[id]
  }

  const TeleportContainer = defineComponent({
    name: 'TeleportContainer',
    setup() {
      const context = useContext()
      onMounted(() => {
        if (context && context.graph) {
          graph = context.graph
        }
      })
      return () => (
        <div style="display: none;">
          {Object.keys(items).map(id => document.getElementById(targetId(id)) ? h(items[id]) : null)}
        </div>
      )
    }
  })

  class VuePortalShapeView extends NodeView {
    protected init() {
      super.init()
      this.cell.on('removed', () => {
        disconnect(this.cell.id)
      })
      const component = this.graph.hook.getVueComponent(this.cell)
      connect(this.cell.id, component, this.cell)
    }
    getComponentContainer() {
      return this.cell.prop('useForeignObject') === false
        ? (this.selectors.content as SVGElement)
        : (this.selectors.foContent as HTMLDivElement)
    }
    confirmUpdate(flag: number) {
      const ret = super.confirmUpdate(flag)
      return this.handleAction(ret, action, () => {
        // 如果是小地图的时候，由于ID只有一个可能导致绘制到小地图上面
        if (this.graph === graph) {
          const root = this.getComponentContainer()
          if (root) {
            root.setAttribute('id', targetId(this.cell.id))
          }
        }
      })
    }
    unmount() {
      disconnect(this.cell.id)
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

