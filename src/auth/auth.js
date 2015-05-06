import Firebase from 'firebase';
import RSVP from 'rsvp';
import firebaseRef from '../lib/firebase-ref';

class Auth {

  constructor (ref) {
    this._ref = ref;
  }

  isAuthenticated () {
    return this._ref.getAuth() != null;
  }

  onAuthChange (callback) {
    this._ref.onAuth(callback);
  }

  login (email, password) {
    return new RSVP.Promise((resolve) => {
      this._ref.authWithPassword({
        email: email,
        password: password
      }, (err, authData) => {
        resolve(authData != null);
      });
    });
  }

  logout () {
    this._ref.unauth();
  }
}

export default new Auth(firebaseRef);
