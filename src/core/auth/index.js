import actions from 'store/actions'
import firebase from 'core/firebase'
import { notification } from 'antd'
import { clearLoader, setLoader } from 'core/loaders'
import i18n from 'core/i18n'


const defaultState = {}

const mapUser = (user) => ({
  userId: user.uid,
  displayName: user.displayName || user.email,
  email: user.email,
  photoURL: user.photoURL,
  authenticated: true
})


export const selectAuth = () => actions.get('auth', defaultState)
export const selectData = () => actions.get('data', defaultState)


export const googleLogin = async () => {
  try {
    setLoader('initializing')
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  } catch (error) {
    notification.error({
      message: 'error',
      description: error.message
    })
  }
}


export const initAuth = async () => {
  try {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user && user.emailVerified) {
        try {
          setLoader('initializing')
          actions.set('auth', mapUser(user))
          await initData()
        } catch (error) {
          actions.delete('auth')
          notification.error({
            message: 'error',
            description: error.message
          })
        } finally {
          clearLoader('initializing')
        }
      } else {
        actions.delete('auth')
      }
    })

    await firebase.auth().getRedirectResult()
  } catch (error) {
    notification.error({
      message: 'error',
      description: error.message
    })
  }
}


export const logout = async () => {
  try {
    await firebase.auth().signOut()
  } catch (error) {
    notification.error({
      message: 'error',
      description: error.message
    })
  }
}


export const initData = async () => {
  const { userId } = selectAuth()
  const ref = firebase.database().ref(`/data/${userId}`)
  const hasData = await ref.once('value')
    .then((snap) => snap.exists())

  if (!hasData) {
    await ref.set({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      series: 'MBC',
      number: 0
    })
  }

  const data = await ref.once('value').then((snap) => snap.val())
  actions.set('data', data)
}


export const updateData = async ({ values }) => {
  const { userId } = selectAuth()
  const updates = Object.entries(values).reduce((acc, [key, value]) => {
    acc[`/data/${userId}/${key}`] = value || null
    return acc
  }, {})
  await firebase.database().ref().update(updates)
  actions.update('data', (data) => ({ ...data, ...values }))
}


export const passwordLoginRegister = async ({ email, password }) => {
  try {
    setLoader('loggingIn')
    let created
    let response
    try {
      response = await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        response = await firebase.auth().createUserWithEmailAndPassword(email, password)
        created = true
      } else {
        throw error
      }
    }
    const { user } = response
    if (user) {
      if (user.emailVerified) {
        actions.set('auth', mapUser(user))
      } else {
        await firebase.auth().signOut()
        if (created) {
          await user.sendEmailVerification()
          notification.success({
            message: 'success',
            description: i18n.t('user_created_please_check_your_inbox')
          })
        } else {
          notification.error({
            message: 'error',
            description: i18n.t('please_check_your_inbox')
          })
        }
      }
    }
  } catch (error) {
    notification.error({
      message: 'error',
      description: error.message
    })
  } finally {
    clearLoader('loggingIn')
  }
}

export const passwordReset = async ({ email }) => {
  try {
    setLoader('resettingPassword')
    await firebase.auth().sendPasswordResetEmail(email)
    notification.success({
      message: 'success',
      description: i18n.t('email_sent_succesfully')
    })
  } catch (error) {
    notification.error({
      message: 'error',
      description: error.message
    })
  } finally {
    clearLoader('resettingPassword')
  }
}