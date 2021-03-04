import setWith from 'lodash/fp/setWith'
import unset from 'lodash/fp/unset'
import updateWith from 'lodash/fp/updateWith'
import isPlainObject from 'lodash/isPlainObject'
import isFunction from 'lodash/isFunction'
import isNil from 'lodash/isNil'
import { STORE_SET, STORE_UPDATE, STORE_DELETE } from './constants'


const reducer = (state = {}, action = {}) => {
  const { method, type, payload } = action
  switch (method) {
    case (STORE_SET): {
      if (isNil(payload)) return unset(type, state)
      return setWith(Object, type, payload, state)
    }
    case (STORE_UPDATE): {
      if (isNil(payload)) return state
      if (isFunction(payload)) return updateWith(Object, type, payload, state)
      return updateWith(Object, type, (value) => {
        if (isPlainObject(value) && isPlainObject(payload)) {
          return { ...value, ...payload }
        } else {
          return payload
        }
      }, state)
    }
    case (STORE_DELETE): return unset(type, state)
    default: return state
  }
}

export default reducer