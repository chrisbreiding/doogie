import Firebase from 'firebase';
const firebaseRef = new Firebase('https://doogie.firebaseio.com');

export const fieldsRef = firebaseRef.child('fields');
export const housesRef = firebaseRef.child('houses');
export const settingsRef = firebaseRef.child('settings');

export default firebaseRef;
