import { createFactory, createClass, PropTypes, DOM } from 'react';
import auth from './auth';
import LoaderComponent from '../loader/loader';

const Loader = createFactory(LoaderComponent);

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
    return DOM.form({ className: 'login', onSubmit: this._onSubmit },
      DOM.header(null,
        DOM.h1(null, 'Please Log In')
      ),
      DOM.label(null, 'Email'),
      DOM.input({ ref: 'email' }),
      DOM.label(null, 'Password'),
      DOM.input({ ref: 'password', type: 'password' }),
      this.state.attemptingLogin ? Loader({ size: 'regular' }) : DOM.button(null, 'Login')
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
