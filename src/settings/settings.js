import _ from 'lodash';
import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent, RouteHandler as RouteHandlerComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import FieldsStore from '../fields/fields-store';
import fieldsActions from '../fields/fields-actions';
import SettingsStore from './settings-store';
import settingsActions from './settings-actions';
import MenuGroupComponent from '../menu/menu-group';
import { icon } from '../lib/util';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);
const RouteHandler = createFactory(RouteHandlerComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  statics: {
    registerStores: {
      fields: FieldsStore,
      settings: SettingsStore
    }
  },

  componentDidMount () {
    fieldsActions.listen();
    settingsActions.listen();
  },

  componentWillUnmount () {
    fieldsActions.stopListening();
    settingsActions.stopListening();
  },

  render () {
    return DOM.div(null,
      DOM.div({ className: 'settings' },
        DOM.header(null,
          Link({ to: 'menu' }, icon('chevron-left', 'Back')),
          DOM.h1(null, 'Settings')
        ),
        DOM.main(null,
          DOM.ul({ className: 'menu' },
            MenuGroup(null, DOM.li(null, Link({ to: 'fields' }, 'Fields'))),
            DOM.li(null, this._settings())
          )
        )
      ),
      RouteHandler()
    );
  },

  _settings () {
    return _.flatten([
      this._textSettings(),
      this._dropdownSettings()
    ]);
  },

  _textSettings () {
    return _.map([
      'Max Upfront Cost',
      'Down Payment',
      'Closing Rate',
      'Interest Rate',
      'Insurance Rate',
      'PMI Rate'
    ], this._textSetting);
  },

  _textSetting (setting) {
    const key = _.camelCase(setting);
    return DOM.fieldset({ key: key },
      DOM.label(null, setting),
      DOM.input({
        ref: key,
        value: this.state.settings[key],
        onChange: _.partial(this._onSettingChange, key)
      })
    );
  },

  _dropdownSettings () {
    return _.map([
      'Cost Field',
      'Zestimate Field',
      'Taxes Field',
      'Misc Upfront Costs Field',
      'Misc Monthly Costs Field',
      'Visit Field',
      'Rooms Field',
      'Year Built Field',
      'A/C Field',
      'Heating Field',
      'Zillow Link Field'
    ], this._dropdownSetting);
  },

  _dropdownSetting (setting) {
    const key = _.camelCase(setting);
    return DOM.fieldset({ key: key },
      DOM.label(null, setting),
      DOM.select({
        ref: key,
        value: this.state.settings[key],
        onChange: _.partial(this._onSettingChange, key)
      }, _.map(this.state.fields.fields, (field) => {
        return DOM.option({ key: field.id, value: field.id }, field.label);
      }))
    );
  },

  _onSettingChange (key) {
    settingsActions.updateSetting(key, this.refs[key].getDOMNode().value);
  }
});
