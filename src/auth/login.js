import { createClass, PropTypes, DOM } from 'react';
import auth from './auth';

export default createClass({
  contextTypes: {
    router: PropTypes.func
  },

  getInitialState () {
    return {
      attemptingLogin: false,
      loginFailed: false
    };
  },

  render () {
    return DOM.form({ onSubmit: this._onSubmit },
      DOM.h2(null, 'Please Login'),
      DOM.label(null, 'Email'),
      DOM.input({ ref: 'email' }),
      DOM.label(null, 'Password'),
      DOM.input({ ref: 'password', type: 'password' }),
      this.state.attemptingLogin ? DOM.p(null, '...') : DOM.button(null, 'Login')
    );
  },

  _onSubmit (e) {
    e.preventDefault()

    const email = this.refs.email.getDOMNode().value;
    const password = this.refs.password.getDOMNode().value;

    this.setState({ attemptingLogin: true }, () => {
      auth.login(email, password).then((didSucceed) => {
        if (didSucceed) {
          this.context.router.transitionTo('menu');
        } else {
          this.setState({
            attemptingLogin: false,
            loginFailed: true
          });
        }
      });
    });
  }
});
