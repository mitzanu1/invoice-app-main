import actions from 'store/actions'
import firebase from 'core/firebase'
import { selectAuth } from 'core/auth'

const defaultState = {}

export const selectPartners = () => actions.get('data.partners', defaultState)


export const getPartner = (values) => {
  const { name, cui, registryNo } = values
  const partners = selectPartners()
  const partner = Object.values(partners).find((partner) => (
    partner.name === name ||
    partner.cui === cui ||
    partner.registryNo === registryNo
  ))

  return partner
}

export const updatePartner = async ({ partnerId, values }) => {
  const { userId } = selectAuth()
  const ref = firebase.database().ref(`/data/${userId}/partners/${partnerId}`)
  await ref.update({ ...values, id: partnerId })
  const partner = await ref.once('value').then((snap) => snap.val())
  actions.set(`data.partners.${partnerId}`, partner)
  return partner
}


export const createPartner = async ({ values }) => {
  const existingPartner = getPartner(values)
  if (existingPartner) {
    const partner = await updatePartner({ partnerId: existingPartner.id, values })
    return partner
  } else {
    const { userId } = selectAuth()
    const ref = firebase.database().ref(`/data/${userId}/partners`).push()
    const partnerId = ref.key
    await ref.set({
      ...values,
      id: partnerId,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    })
    const partner = await ref.once('value').then((snap) => snap.val())
    actions.set(`data.partners.${partnerId}`, partner)
    return partner
  }
}

export const createVendor = async ({ values }) => {
  const { userId } = selectAuth()
  const ref = firebase.database().ref(`/data/${userId}/vendor`)
  ref.set({
    ...values,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  })
  const company = await ref.once('value').then((snap) => snap.val())
  actions.set('data.vendor', company)
  return company
}


export const deletePartner = async ({ partnerId }) => {
  const { userId } = selectAuth()
  await firebase.database()
    .ref(`/data/${userId}/partners/${partnerId}`)
    .remove()
  actions.delete(`data.partners.${partnerId}`)
}
