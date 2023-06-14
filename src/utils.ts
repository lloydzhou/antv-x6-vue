// @ts-nocheck
import { watchEffect, defineComponent, shallowRef } from 'vue'
import { useContext, contextSymbol } from './GraphContext'

export function debounce<T extends []>(fn: (...args: T) => void, delay = 60) {
  let timer: number | null = null

  return (...args: T) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export const mergeOption = (defaultOptions, options) => {
  Object.keys(defaultOptions).forEach(name => {
    if (defaultOptions[name] && typeof defaultOptions[name] == 'object') {
      const value = mergeOption(defaultOptions[name], options[name] || {})
      options[name] = value
    } else if (options[name] === undefined && defaultOptions[name] !== undefined) {
      options[name] = defaultOptions[name]
    }
  })
  return options
}

export const processProps = (props) => {
  return Object.entries(props).reduce((res, [name, value]) => {
    if (name.startsWith('on')) {
      res.events[name.substr(2).toLowerCase()] = value
    } else {
      // enabled --> enabled: true
      res.props[name] = value === "" ? true : value
    }
    return res
  }, {props:{}, events: {}})
}   

export const bindEvent = (node, events, graph) => {
  // 绑定事件都是包了一层的，返回一个取消绑定的函数
  // 如果没有传node，那就直接绑定到graph上面
  const ubindEvents = Object.entries(events).map(([name, callback]) => {
    const eventName = node ? `cell:${name}` : name
    const handler = (e: any) => {
      const { cell } = e
      if (node && cell.id === node.id) {
        // @ts-ignore
        callback(e)
      } else if (!node){
        callback(e)
      }
    }     
    graph.on(eventName, handler)
    return () => graph.off(eventName, handler)
  })    
  return () => ubindEvents.forEach(h => h())
}   

export const createPluginComponent = (name, Plugin) => {
  return defineComponent({
    name,
    inheritAttrs: false,
    inject: [contextSymbol],
    setup(_, { attrs: options }) {
      const { graph } = useContext()
      const plugin = shallowRef<typeof Plugin>()
      watchEffect((cleanup) => {
        plugin.value = new Plugin(options)
        graph.use(plugin.value)
        cleanup(() => {
          if (plugin.value) {
            plugin.value.dispose()
          }
        })
      })
      return () => null
    }
  })
}

