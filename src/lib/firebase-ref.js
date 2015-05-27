import Firebase from 'firebase';
const appName = localStorage.appName || 'doogie';
const firebaseRef = new Firebase(`https://${appName}.firebaseio.com`);

export const fieldsRef = firebaseRef.child('fields');
export const housesRef = firebaseRef.child('houses');
export const settingsRef = firebaseRef.child('settings');

export default firebaseRef;
