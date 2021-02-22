import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const appName = localStorage.appName || process.env.APP_NAME
const apiKey = localStorage.apiKey || process.env.API_KEY
const projectId = localStorage.projectId || process.env.PROJECT_ID

const app = firebase.initializeApp({
  apiKey,
  projectId,
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
})

export const firebaseRef = app.database().ref()
