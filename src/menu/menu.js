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
      DOM.ul({ className: 'menu full-screen' },
        MenuGroup(null, DOM.li(null, Link({ to: 'settings' },
          DOM.i({ className: 'fa fa-cog' }),
          ' Settings'
        ))),
        Houses(),
        MenuGroup(null, DOM.li(null, Link({ to: 'house', params: { id: 'new' }},
          DOM.i({ className: 'fa fa-plus' }),
          ' Add house'
        ))),
        MenuGroup(null, DOM.li(null, Link({ to: 'logout' },
          DOM.i({ className: 'fa fa-sign-out' }),
          ' Logout'
        )))
      ),
      createFactory(RouteHandler)({ className: 'foo' })
    );
  }
});
