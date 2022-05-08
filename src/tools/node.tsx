// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, watch, provide, shallowReactive, inject, Fragment } from 'vue';

import { cellContextSymbol } from '../GraphContext'
import { mergeOption } from '../utils'


export const NodeButton = defineComponent({
  name: 'NodeButton',
  props: ['x', 'y', 'offset', 'rotate', 'markup'],
  inject: [cellContextSymbol],
  setup(props, { emit }) {
    const { cell } = inject(cellContextSymbol) || {}
    const name = 'button'
    const onClick = (args) => emit('click', args)
    const clear = () => {
      if (cell.hasTool(name)) {
        cell.removeTool(name)
      }
    }
    onMounted(() => {
      clear()
      cell.addTools({ name, args: mergeOption(props, { onClick }) })
    })
    onUnmounted(() => {
      clear()
    })
  }
})

export const NodeButtonRemove = defineComponent({
  name: 'NodeButtonRemove',
  props: ['x', 'y', 'offset', 'rotate', 'markup'],
  inject: [cellContextSymbol],
  setup(props, { emit }) {
    const { cell } = inject(cellContextSymbol) || {}
    const name = 'button-remove'
    const onClick = (args) => emit('click', args)
    const clear = () => {
      if (cell.hasTool(name)) {
        cell.removeTool(name)
      }
    }
    onMounted(() => {
      clear()
      cell.addTools({ name, args: mergeOption(props, { onClick }) })
    })
    onUnmounted(() => {
      clear()
    })
  }
})

export const NodeBoundary = defineComponent({
  name: 'NodeBoundary',
  props: ['tagName', 'padding', 'attrs'],
  inject: [cellContextSymbol],
  setup(props) {
    const { cell } = inject(cellContextSymbol) || {}
    const name = 'boundary'
    const clear = () => {
      if (cell.hasTool(name)) {
        cell.removeTool(name)
      }
    }
    onMounted(() => {
      clear()
      cell.addTools({ name, args: mergeOption(props, {})})
    })
    onUnmounted(() => {
      clear()
    })
  }
})

export const NodeEditor = defineComponent({
  name: 'NodeEditor',
  props: ['event', 'attrs/fontSize', 'attrs/color', 'attrs/fontFamily', 'attrs/backgroundColor', 'getText', 'setText'],
  inject: [cellContextSymbol],
  setup(props) {
    const { cell } = inject(cellContextSymbol) || {}
    const name = 'node-editor'
    const clear = () => {
      if (cell.hasTool(name)) {
        cell.removeTool(name)
      }
    }
    onMounted(() => {
      clear()
      cell.addTools({ name, args: mergeOption(props, {})})
    })
    onUnmounted(() => {
      clear()
    })
  }
})

export default { NodeButton, NodeButtonRemove, NodeBoundary, NodeEditor }
