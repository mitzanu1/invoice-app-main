import actions from 'store/actions'


const defaultState = {}

export const selectParams = () => actions.get('params.partners', defaultState)

export const setSearch = (search) => actions.set('params.partners.search', search)