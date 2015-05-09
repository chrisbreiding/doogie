import { createClass, createFactory, PropTypes, DOM } from 'react';
import { RouteHandler as RouteHandlerComponent } from 'react-router';
import auth from '../auth/auth';
import MenuComponent from '../menu/menu';

const Menu = createFactory(MenuComponent);
const RouteHandler = createFactory(RouteHandlerComponent);

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
    return DOM.div(null, Menu(), RouteHandler());
  }
});
