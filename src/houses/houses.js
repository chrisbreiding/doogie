import { createClass, createFactory, PropTypes, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import auth from '../auth/auth';

const Link = createFactory(LinkComponent);

export default createClass({
  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    willTransitionTo (transition) {
      if (!auth.isAuthenticated()) {
        transition.redirect('/login');
      }
    }
  },

  componentDidMount () {
    auth.onAuthChange(() => {
      if (!auth.isAuthenticated()) {
        this.context.router.transitionTo('/login');
      }
    });
  },

  render () {
    return DOM.div(null,
      DOM.h2(null, 'Houses'),
      Link({ to: 'logout' }, 'Logout')
    );
  }
});
