import actions from 'store/actions'

const defaultState = {}

export const showModal = (Component, props) => actions.set('modal', { Component, props })
export const hideModal = () => actions.delete('modal')
export const selectModal = () => actions.get('modal', defaultState)