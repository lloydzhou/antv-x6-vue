// @ts-nocheck
import { provide, inject } from 'vue'

export const contextSymbol = String(Symbol('contextSymbol'))

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

