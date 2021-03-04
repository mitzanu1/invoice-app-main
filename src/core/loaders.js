import actions from 'store/actions'

export const selectLoader = (path) => actions.get(`loaders.${path}`, 0) > 0
export const setLoader = (path) => actions.update(`loaders.${path}`, (loader = 0) => loader + 1)
export const clearLoader = (path) => actions.update(`loaders.${path}`, (loader = 0) => loader - 1)