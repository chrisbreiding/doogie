import { createClass, createFactory, PropTypes, DOM } from 'react';
import { RouteHandler as RouteHandlerComponent, Navigation } from 'react-router';
import auth from '../auth/auth';
import MenuComponent from '../menu/menu';

const Menu = createFactory(MenuComponent);
const RouteHandler = createFactory(RouteHandlerComponent);

export default createClass({
  mixins: [Navigation],

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
        this.transitionTo('login');
      }
    });
  },

  render () {
    return DOM.div(null, Menu(), RouteHandler(this.props));
  }
});
