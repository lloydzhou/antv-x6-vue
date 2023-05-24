// @ts-nocheck
import { defineComponent, onMounted, onUnmounted, ref, shallowReactive, toRefs } from 'vue';
import { useContext } from '../GraphContext'


export const useContextMenu: {[key: string]: any} = (props) => {
  const { bindType = 'node', bindEvent='contextmenu', container } = props;
  const { graph } = useContext()
  /** createContext内的数据 */
  const contextRef = shallowReactive({
    visible: false,
    x: 0, y: 0,
    item: null,
    view: null,
  });

  const oldOptions = ref({
    preventDefaultContextMenu: true,
    preventDefaultBlankAction: true,
  })

  const handleShow = ({ e, x, y }) => {
    e.preventDefault();
    e.stopPropagation();
    if (!container.value) {
      return
    }
    contextRef.visible = true
    // 将画布本地坐标转换为画布坐标
    const {x: px, y: py} = graph.localToGraph(x, y)
    contextRef.x = px
    contextRef.y = py
    if (bindType == 'node' || bindType == 'edge') {
      const views = graph.findViewsFromPoint(x, y).filter(v => {
        if (bindType == 'edge') {
          return !!v.targetView
        }
        return !v.targetView
      })
      if (views.length) {
        const view = views.sort((a, b) => a.cell.getZIndex() < b.cell.getZIndex()).pop()
        contextRef.view = view
        contextRef.item = view.cell
      }
    }
  }
  const handleClose = () => {
    contextRef.visible = false
    contextRef.x = 0
    contextRef.y = 0
  }

  onMounted(() => {
    graph.on(`${bindType}:${bindEvent}`, handleShow);
    if (!(bindType == 'blank' && bindEvent == 'click')) {
      graph.on('blank:click', handleClose);
    }
    graph.on('blank:mousedown', handleClose);
    graph.on('blank:mousewheel', handleClose);
    // if (container.value) {
    //   container.value.addEventListener('click', handleClose, false)
    // }

    // 组件加载的时候保存旧的配置
    const { preventDefaultContextMenu = true, preventDefaultBlankAction = true } = graph.options || {}
    oldOptions.value = { preventDefaultContextMenu, preventDefaultBlankAction }
  })
  onUnmounted(() => {
    graph.off(`${bindType}:${bindEvent}`, handleShow);
    graph.off('blank:click', handleClose);
    graph.off('blank:mousedown', handleClose);
    graph.off('blank:mousewheel', handleClose);
    // if (container.value) {
    //   container.value.removeEventListener('click', handleClose, false)
    // }

    // 卸载的时候恢复之前的值
    const { preventDefaultContextMenu = true, preventDefaultBlankAction = true } = oldOptions.value || {}
    graph.options.preventDefaultContextMenu = preventDefaultContextMenu
    graph.options.preventDefaultBlankAction = preventDefaultBlankAction
  })

  return {
    ...toRefs(contextRef),
    onShow: handleShow,
    onClose: handleClose,
  }
}

const defaultStyle: CSSProperties = {
  width: '120px',
  boxShadow: '0 4px 12px rgb(0 0 0 / 15%)',
};

export default defineComponent<{bindType?: string, bindEvent?: string, style?: CSSProperties}>({
  name: 'ContextMenu',
  props: ['bindType', 'bindEvent', 'style'],
  setup(props) {
    const { bindType, bindEvent } = props
    const container = ref()
    const contextmenu = useContextMenu({
      bindType: bindType || 'node',
      bindEvent: bindEvent || 'contextmenu',
      container,
    })

    return {
      ...contextmenu,
      container,
    }
  },
  render() {
    const { style, visible, x, y, item, onClose } = this
    const positionStyle: CSSProperties = {
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
    };
    const id = item && item.id || '';
    return (
       <div
         ref="container"
         className="x6-widget-contextmenu"
         style={{ ...defaultStyle, ...style, ...positionStyle }}
         key={id}
         onClick={e => onClose(e)}
       >
         {visible && this.$slots.default
           ? this.$slots.default({visible, x, y, item, onClose,id})
           : null
         }
       </div>
    )
  }
})


