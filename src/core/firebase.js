import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'


firebase.initializeApp({
  apiKey: "AIzaSyABXjAulfa2QYb9eOLWSiChfVxMsIAMfj8",
  authDomain: "invoice-app-63185.firebaseapp.com",
  databaseURL: "https://invoice-app-63185-default-rtdb.firebaseio.com",
  projectId: "invoice-app-63185",
  messagingSenderId: "442485802345",
  storageBucket: "invoice-app-63185.appspot.com",
  appId: "1:442485802345:web:d13be168b034ec7a0be9f8"
})

export default firebase

