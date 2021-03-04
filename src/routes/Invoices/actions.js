import actions from 'store/actions'


const defaultState = {}

export const selectParams = () => actions.get('params.invoices', defaultState)

export const setSearch = (search) => actions.set('params.invoices.search', search)
export const setMonth = (month) => actions.set('params.invoices.month', month)