import get from 'lodash/get'
import { STORE_SET, STORE_UPDATE, STORE_DELETE } from './constants'
import store from '.'

const actions = {
  get: (type, defautValue) => get(store.getState(), type, defautValue),
  set: (type, payload) => store.dispatch({
    type,
    payload,
    method: STORE_SET
  }),
  update: (type, payload) => store.dispatch({
    type,
    payload,
    method: STORE_UPDATE
  }),
  delete: (type) => store.dispatch({
    type,
    method: STORE_DELETE
  })
}

export default actions