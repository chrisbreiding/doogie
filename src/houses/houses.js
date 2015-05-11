import _ from 'lodash';
import { createClass, createFactory, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HousesStore from './houses-store';
import actions from './houses-actions';
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
    actions.listen();
  },

  componentWillUnmount () {
    actions.stopListening();
  },

  render () {
    const menuGroupProps = {
      sortable: true,
      onSortingUpdate: actions.updateSorting.bind(actions)
    };

    return MenuGroup(menuGroupProps, _.map(this.state.houses, (house) => {
      return DOM.li({ key: house.id, className: 'sortable-item', 'data-id': house.id },
        DOM.i({ className: 'fa fa-bars' }),
        Link({ to: 'house', params: house }, house[HOUSE_NAME_KEY])
      );
    }));
  }
});
