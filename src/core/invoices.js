import actions from 'store/actions'
import firebase from 'core/firebase'
import _ from 'lodash'
import { selectAuth, updateData } from 'core/auth'


const defaultState = {}

export const selectInvoices = () => actions.get('data.invoices', defaultState)

export const selectInvoiceId = () => actions.get('data.invoiceId')
export const setInvoiceId = (invoiceId) => actions.set('data.invoiceId', invoiceId)


export const updateInvoice = async ({ invoiceId, values }) => {
  const { userId } = selectAuth()
  const ref = firebase.database().ref(`/data/${userId}/invoices/${invoiceId}`)
  await ref.update(values)
  const invoice = await ref.once('value').then((snap) => snap.val())
  actions.set(`data.invoices.${invoiceId}`, invoice)
  return invoice
}


export const createInvoice = async ({ values }) => {
  const { userId } = selectAuth()
  const ref = firebase.database().ref(`/data/${userId}/invoices`).push()
  const invoiceId = ref.key
  await ref.set({
    ...values,
    id: invoiceId,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  })
  const invoice = await ref.once('value').then((snap) => snap.val())
  await updateData({ values: _.pick(invoice, ['series', 'number']) })
  actions.set(`data.invoices.${invoiceId}`, invoice)
  return invoice
}


export const deleteInvoice = async ({ invoiceId }) => {
  const { userId } = selectAuth()
  await firebase.database()
    .ref(`/data/${userId}/invoices/${invoiceId}`)
    .remove()
  actions.delete(`data.invoices.${invoiceId}`)
}


export const createInvoiceProduct = async ({ invoiceId, values }) => {
  const { userId } = selectAuth()
  const ref = firebase.database().ref(`/data/${userId}/invoices/${invoiceId}/products`).push()
  const productId = ref.key
  await ref.set({
    ...values,
    id: productId,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  })
  const product = await ref.once('value').then((snap) => snap.val())
  actions.set(`data.invoices.${invoiceId}.products.${productId}`, product)
  return product
}


export const updateInvoiceProduct = async ({ invoiceId, productId, values }) => {
  const { userId } = selectAuth()
  const ref = firebase.database()
    .ref(`/data/${userId}/invoices/${invoiceId}/products/${productId}`)
  await ref.update(values)
  const product = await ref.once('value').then((snap) => snap.val())
  actions.set(`data.invoices.${invoiceId}.products.${productId}`, product)
}


export const deleteInvoiceProduct = async ({ invoiceId, productId }) => {
  const { userId } = selectAuth()
  await firebase.database()
    .ref(`/data/${userId}/invoices/${invoiceId}/products/${productId}`)
    .remove()
  actions.delete(`data.invoices.${invoiceId}.products.${productId}`)
}