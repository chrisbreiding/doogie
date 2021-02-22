import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { action, observable } from 'mobx'

class Auth {
  @observable isAuthenticating = true
  @observable isAuthenticated = false

  listenForAuthChanges () {
    firebase.auth().onAuthStateChanged(action((user) => {
      this.isAuthenticating = false
      this.isAuthenticated = !!user
    }))
  }

  onAuthChange (callback) {
    return firebase.auth().onAuthStateChanged((user) => {
      callback(!!user)
    })
  }

  login (email, password) {
    this.isAuthenticating = true

    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCred) => {
      return !!userCred.user
    })
    .catch(() => {
      return false
    })
    .then(action((isAuthed) => {
      this.isAuthenticated = isAuthed
      this.isAuthenticating = false

      return isAuthed
    }))
  }

  logout () {
    this.isAuthenticated = false

    firebase.auth().signOut()
  }
}

export const auth = new Auth()
