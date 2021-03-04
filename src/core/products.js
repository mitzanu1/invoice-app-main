import actions from 'store/actions'
import firebase from 'core/firebase'
import { selectAuth } from 'core/auth'


const defaultState = {}

export const selectProducts = () => actions.get('data.products', defaultState)


export const getProduct = (values) => {
  const { name } = values
  const products = selectProducts()
  const product = Object.values(products).find((product) => product.name === name)
  return product
}

export const createProduct = async ({ values }) => {
  const existingProduct = getProduct(values)
  if (existingProduct) {
    const product = await updateProduct({ productId: existingProduct.id, values })
    return product
  } else {
    const { userId } = selectAuth()
    const ref = firebase.database().ref(`/data/${userId}/products`).push()
    const productId = ref.key
    await ref.set({
      ...values,
      id: productId,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    })
    const product = await ref.once('value').then((snap) => snap.val())
    actions.set(`data.products.${productId}`, product)
    return product
  }
}


export const updateProduct = async ({ productId, values }) => {
  const { userId } = selectAuth()
  const ref = firebase.database().ref(`/data/${userId}/products/${productId}`)
  await ref.update({ ...values, id: productId })
  const product = await ref.once('value').then((snap) => snap.val())
  actions.set(`data.products.${productId}`, product)
  return product
}


export const deleteProduct = async ({ productId }) => {
  const { userId } = selectAuth()
  await firebase.database()
    .ref(`/data/${userId}/products/${productId}`)
    .remove()
  actions.delete(`data.products.${productId}`)
}