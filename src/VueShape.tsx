// @ts-nocheck
import { h, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { VueShape as VueShapeContainer } from '@antv/x6-vue-shape';
import { useContext, contextSymbol } from './GraphContext'
import { NodeProps, useCellEvent, useWatchProps } from './Shape'

export const VueShapeProps = NodeProps.concat('primer', 'useForeignObject', 'component')

export const useVueShape = (props, { slots, emit }) => {
  const { graph } = useContext()
  const {
    id,
    width=60, height=60,
    primer='circle', useForeignObject=true, component,  // 这几个是@antv/x6-vue-shape独有的参数
    magnet,
    ...otherOptions
  } = props
  const cell = ref()

  const added = (e) => emit('added', e)
  const removed = (e) => emit('removed', e)

  const create = () => {
    cell.value = new VueShapeContainer({
      id, width, height,
      primer, useForeignObject,
      // 这里将自己的slots中的内容强行放到画布中去
      // 这样图结构的交互还有一些操作逻辑交给x6
      // 通过vue绘制的组件渲染和组件内部交互逻辑交给用户
      component: component
        ? component
        : () => h('div', {key: id, class: 'vue-shape'}, slots.default ? slots.default({props, item: cell}) : null),
      ...otherOptions,
    })
    // 增加配置是否可连接
    if (magnet === false || magnet === true) {
      cell.value.setAttrByPath(`fo/magnet`, !!props.magnet)
    }
    cell.value.once('added', added)
    cell.value.once('removed', removed)
    graph.addCell(cell.value)
  }
  // 监听其他变化
  useWatchProps(cell, props)
  // 默认给组件绑定一个监听change:*的回调
  // 增加配置是否可以连线
  watch(() => props.magnet, magnet => (magnet === false || magnet === true) && cell.value.setAttrByPath(`fo/magnet`, !!magnet))
  useCellEvent('cell:change:*', ({ key, ...ev }) => emit(`cell:change:${key}`, ev), { cell })
  
  onMounted(() => {
    create()
  })
  onUnmounted(() => {
    graph.removeCell(id)
  })

  return cell
}

const VueShape = defineComponent({
  name: 'VueShape',
  props: VueShapeProps,
  inject: [contextSymbol],
  setup(props, context) {
    useVueShape(props, context)
    useCellEvent('node:change:*', e => context.emit('changed', e))
    useCellEvent('changed', e => context.emit('changed', e))
    return () => null
  }
})

VueShape.VueShapeContainer = VueShapeContainer
VueShape.VueShapeProps = VueShapeProps
VueShape.useVueShape = useVueShape

export default VueShape
