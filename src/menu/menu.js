import { createClass, createFactory, PropTypes, DOM } from 'react';
import { Link as LinkComponent, RouteHandler } from 'react-router';
import auth from '../auth/auth';
import HousesComponent from '../houses/houses';
import MenuGroupComponent from './menu-group';

const Link = createFactory(LinkComponent);
const Houses = createFactory(HousesComponent);
const MenuGroup = createFactory(MenuGroupComponent);

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
      DOM.ul(null,
        MenuGroup(null, DOM.li(null, Link({ to: 'logout' }, 'Logout'))),
        MenuGroup(null, DOM.li(null, Link({ to: 'settings' }, '* Settings'))),
        Houses(),
        MenuGroup(null, DOM.li(null, Link({ to: 'house', params: { id: 'new' }}, '+ Add house')))
      ),
      createFactory(RouteHandler)()
    );
  }
});
