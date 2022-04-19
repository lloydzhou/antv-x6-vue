// @ts-nocheck
export const mergeOption = (defaultOptions, options) => {
  Object.keys(defaultOptions).forEach(name => {
    // console.log('mergeOption', name, defaultOptions[name], options[name])
    if (typeof defaultOptions[name] == 'object') {
      const value = mergeOption(defaultOptions[name], options[name] || {})
      options[name] = value
    } else if (options[name] === undefined && defaultOptions[name] !== undefined) {
      options[name] = defaultOptions[name]
    }
  })
  return options
}


