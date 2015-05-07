import _ from 'lodash';
import { createClass, createFactory, PropTypes, DOM } from 'react';
import { Link as LinkComponent, RouteHandler } from 'react-router';
import auth from '../auth/auth';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HousesStore from './houses-store';
import { listen, stopListening } from './houses-actions';
import HouseComponent from '../house/house';
import MenuGroupComponent from './menu-group';

const Link = createFactory(LinkComponent);
const House = createFactory(HouseComponent);
const MenuGroup = createFactory(MenuGroupComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    registerStore: HousesStore,

    willTransitionTo (transition) {
      if (!auth.isAuthenticated()) {
        transition.redirect('/login');
      }
    }
  },

  componentDidMount () {
    listen();

    auth.onAuthChange(() => {
      if (!auth.isAuthenticated()) {
        this.context.router.transitionTo('/login');
      }
    });
  },

  componentWillUnmount () {
    stopListening();
  },

  render () {
    return DOM.div(null,
      DOM.ul(null,
        MenuGroup(null, DOM.li(null, Link({ to: 'logout' }, 'Logout'))),
        MenuGroup(null, _.map(this.state.houses, (house) => {
          return DOM.li({ key: house.id },
            Link({ to: 'house', params: house }, house.name)
          );
        }))
      ),
      createFactory(RouteHandler)()
    );
  }
});
