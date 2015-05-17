import _ from 'lodash';
import { createClass, createFactory, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HousesStore from './houses-store';
import houseActions from './houses-actions';
import SettingsStore from '../settings/settings-store';
import settingsActions from '../settings/settings-actions';
import MenuGroupComponent from '../menu/menu-group';
import { HOUSE_NAME_KEY } from '../lib/constants';
import { icon } from '../lib/util';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  statics: {
    registerStores: {
      houses: HousesStore,
      settings: SettingsStore
    }
  },

  componentDidMount () {
    houseActions.listen();
    settingsActions.listen();
  },

  componentWillUnmount () {
    houseActions.stopListening();
    settingsActions.stopListening();
  },

  render () {
    const menuGroupProps = {
      sortable: true,
      onSortingUpdate: houseActions.updateSorting.bind(houseActions)
    };

    return MenuGroup(menuGroupProps, _.map(this.state.houses[this.props.dataKey], this._house));
  },

  _house (house) {
    let description = '$' + house[this.state.settings.costField];
    const visit = house[this.state.settings.visitField];
    if (visit) description += ', ' + visit;

    return DOM.li({ key: house.id, className: 'sortable-item list-house', 'data-id': house.id },
      icon('bars'),
      Link({ to: 'house', params: house },
        DOM.h3(null, house[HOUSE_NAME_KEY]),
        DOM.p(null, description)
      )
    );
  }
});
