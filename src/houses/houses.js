import _ from 'lodash';
import { createClass, createFactory, PropTypes, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import auth from '../auth/auth';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HouseStore from './house-store';
import { listen, stopListening } from './house-actions';
import HouseComponent from './house';
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
    registerStore: HouseStore,

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
    return DOM.ul(null,
      MenuGroup(null, DOM.li(null, Link({ to: 'logout' }, 'Logout'))),
      MenuGroup(null, _.map(this.state.houses, (house) => {
        return House(_.extend({ key: house.id }, house));
      }))
    );
  }
});
