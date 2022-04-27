// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, watch, provide, shallowReactive, inject } from 'vue';

import { cellContextSymbol } from './Shape'
import { mergeOption } from './utils'


export const portGroupContextSymbol = String(Symbol('x6PortGroupContextSymbol'))

export const PortGroup = defineComponent({
  name: 'PortGroup',
  props: ['name', 'markup', 'attrs', 'zIndex', 'position', 'label'],
  inject: [cellContextSymbol],
  setup(props, { slots }) {
    const { cell } = inject(cellContextSymbol) || {}
    const context = shallowReactive({ name: props.name })
    provide(portGroupContextSymbol, context)
    onMounted(() => {
      const { name, ...options } = props
      if (cell) {
        cell.setPropByPath(`ports/groups/${name}`, mergeOption(options, {}))
      }
    })
    return () => slots.default ? slots.default() : null
  }
})

export const Port = defineComponent({
  name: 'Port',
  props: ['id', 'magnet', 'group', 'args', 'markup', 'attrs', 'zIndex', 'label'],
  inject: [cellContextSymbol, portGroupContextSymbol],
  setup(props) {
    const { cell } = inject(cellContextSymbol) || {}
    const groupContext = inject(portGroupContextSymbol)

    const setMagnet = (magnet) => {
      const { selector } = cell.getPortMarkup()
      if (magnet === false || magnet === true) {
        cell.setPortProp(props.id, `attrs/${selector}/magnet`, !!magnet)
      }
    }
    // 监听magnet变化，动态设置magnet
    watch(() => props.magnet, setMagnet)
    onMounted(() => {
      const { id, magnet, group, ...options } = props
      // Port单独使用的时候，groupcontext为空
      const { name: defaultGroup } = groupContext || {}
      if (cell) {
        if (cell.hasPort(id)) {
          cell.setPortProp(id, mergeOption({ ...options, group: group || defaultGroup }, {}))
        } else {
          cell.addPort(mergeOption({ ...options, id, group: group || defaultGroup }, {}))
        }
        setMagnet(magnet !== false)
      }
    })
    onUnmounted(() => {
      cell && cell.removePort(props.id)
    })
    return () => null
  }
})

export default Port


