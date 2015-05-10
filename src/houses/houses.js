import _ from 'lodash';
import { createClass, createFactory, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HousesStore from './houses-store';
import { listen, stopListening } from './houses-actions';
import MenuGroupComponent from '../menu/menu-group';
import { HOUSE_NAME_KEY } from '../lib/constants';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  statics: {
    registerStore: HousesStore
  },

  componentDidMount () {
    listen();
  },

  componentWillUnmount () {
    stopListening();
  },

  render () {
    return MenuGroup(null, _.map(this._sortedHouses(), (house) => {
      return DOM.li({ key: house.id },
        Link({ to: 'house', params: house }, house[HOUSE_NAME_KEY])
      );
    }));
  },

  _sortedHouses () {
    return _(this.state.houses)
      .values()
      .sortBy('order')
      .value();
  }
});
