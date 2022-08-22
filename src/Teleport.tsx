// @ts-nocheck
import { onMounted, shallowReactive, shallowRef, effect, markRaw, defineComponent } from "vue";
import { h, Teleport, Fragment, VNode, VNodeData, provide, inject, createApp } from "vue";
import { Graph, Node, Dom } from '@antv/x6'

const items = shallowReactive<{[key: string]: any}>({})
const mounted = shallowRef<boolean>(false)

export const TeleportContainer = defineComponent({
  name: 'TeleportContainer',
  setup() {
    onMounted(() => {
      mounted.value = true
    })
    return () =>
      h(
        Fragment,
        {},
        Object.keys(items).map((id) => h(items[id])),
      )
  },
})

export const connect = (
  id: string,
  node: Node,
  graph: Graph,
  component: any,
  container: HTMLDivElement,
) => {
  items[id] = markRaw(
    defineComponent({
      setup(props) {
        provide('getGraph', graph)
        provide('getNode', node)
        return () => {
          return h(Teleport, { to: container } as typeof VNodeData, [
            h(component, props),
          ])
        }
      },
    }),
  )
}

export const disconnect = (id: string) => {
  delete items[id]
}

export function wrap(Component: any) {
  // 如果使用原始的方式挂载，就需要这个变量
  let vm: any = null

  return {
    mount: async (props: any) => {
      const { graph, node, container } = props
      const id = `${graph.view.cid}:${node.id}`
      Dom.requestAnimationFrame(() => {
        if (mounted.value) {
          // 如果Teleport组件已经挂载，就使用，否则使用原始createApp
          // 这里使用graph.view.id做前缀
          connect(id, node, graph, Component, container)
        } else {
          vm = createApp({
            render() {
              return h(Component as any, props)
            },
            provide() {
              return {
                getGraph: () => graph,
                getNode: () => node,
              }
            },
          })
          vm.mount(container)
        }
      })
    },
    unmount: async (props: any) => {
      const { graph, node, container } = props
      if (mounted.value) {
        // 如果Teleport组件挂载过就从items列表里面移除，否则使用unmount移除
        const id = `${graph.view.cid}:${node.id}`
        disconnect(id)
      } else {
        if (vm) {
          vm.unmount()
        }
      }
    }
  }
}


export function useTeleport() {
  return defineComponent({
    name: 'TeleportContainer',
    setup() {
      onMounted(() => {
        mounted.value = true
      })
      return () => {
        return h(
          Fragment,
          {},
          Object.keys(items).map((id) => h(items[id])),
        )
      }
    },
  })
}

