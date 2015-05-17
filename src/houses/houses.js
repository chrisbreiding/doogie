import _ from 'lodash';
import { createClass, createFactory, PropTypes, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HousesStore from './houses-store';
import housesActions from './houses-actions';
import FieldsStore from '../fields/fields-store';
import fieldsActions from '../fields/fields-actions';
import SettingsStore from '../settings/settings-store';
import settingsActions from '../settings/settings-actions';
import HouseComponent from '../house/house';
import { icon } from '../lib/util';

const House = createFactory(HouseComponent);
const Link = createFactory(LinkComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    registerStores: {
      houses: HousesStore,
      fields: FieldsStore,
      settings: SettingsStore
    }
  },

  componentDidMount () {
    housesActions.listen();
    fieldsActions.listen();
    settingsActions.listen();
  },

  componentWillUnmount () {
    housesActions.stopListening();
    fieldsActions.stopListening();
    settingsActions.stopListening();
  },

  render () {
    const houses = this.state.houses.houses;

    return DOM.div({ className: 'houses full-screen' },
      DOM.header(null,
        Link({ to: 'menu' }, icon('chevron-left', 'Back')),
        DOM.h1()
      ),
      DOM.main(null,
        DOM.div({ className: 'container', style: { width: `${houses.length * 21.5}em` }}, _.map(houses, (house) => {
          return House({
            key: house.id,
            house: { house },
            fields: this.state.fields,
            settings: this.state.settings,
            onChange: _.partial(this._onChange, house.id),
            onRemove: _.partial(this._onRemove, house.id)
          });
        }))
      )
    );
  },

  _onChange (id, key, value) {
    housesActions.updateHouse({ id: id, [key]: value });
  },

  _onRemove (id) {
    housesActions.removeHouse(id);
  }
});
