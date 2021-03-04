import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'


firebase.initializeApp({
  apiKey: 'AIzaSyBPWPlu-yxuIYAEzszqjxM6coY622cFyrY',
  authDomain: 'invoice-app-1605452741766.firebaseapp.com',
  databaseURL: 'https://invoice-app-1605452741766.firebaseio.com/',
  projectId: 'invoice-app-1605452741766'
})

export default firebase

