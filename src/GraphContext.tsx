// @ts-nocheck
import { provide, inject } from 'vue'

export const contextSymbol = String(Symbol('x6ContextSymbol'))
export const cellContextSymbol = String(Symbol('x6cellContextSymbol'))
export const portGroupContextSymbol = String(Symbol('x6PortGroupContextSymbol'))



export const createContext = (context) => {
  provide(contextSymbol, context)
}

export const useContext = () => {
  const context = inject(contextSymbol)
  if (!context) {
    throw new Error('context must be used after useProvide')
  }
  return context
}

export default {
  createContext,
  contextSymbol,
  useContext,
}

