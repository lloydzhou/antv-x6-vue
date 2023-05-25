// @ts-nocheck
import { shallowReactive, defineComponent } from "vue";
import { h, Fragment } from "vue";
import createTeleportRender from 'x6-html-shape/dist/teleport'
import createVue3Render from 'x6-html-shape/dist/vue'

const state = shallowReactive<{[key: string]: any}>({items: []})

export const TeleportContainer = defineComponent({
  name: 'TeleportContainer',
  setup() {
    return () => h(
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

