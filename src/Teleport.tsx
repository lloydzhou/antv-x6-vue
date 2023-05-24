// @ts-nocheck
import { onUpdated, onMounted, shallowReactive, shallowRef, watchEffect, watch, markRaw, defineComponent, computed } from "vue";
import { h, Teleport, Fragment, VNode, VNodeData, provide, inject, createApp } from "vue";
import { Graph, Node, Dom } from '@antv/x6'
import createTeleportRender from 'x6-html-shape/dist/teleport'

const state = shallowReactive<{[key: string]: any}>({items: []})

export const TeleportContainer = defineComponent({
  name: 'TeleportContainer',
  setup() {
    return () =>
      h(
        Fragment,
        {},
        state.items.map((item) => h(item)),
      )
  },
})

export function useTeleport() {
  return TeleportContainer
}

export function createRender(Component: any) {
  const [render, Container] = createTeleportRender(Component)
  state.items = [...state.items, Container]
  return render
}

