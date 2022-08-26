// @ts-nocheck
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


