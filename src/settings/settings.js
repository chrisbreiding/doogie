import _ from 'lodash';
import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent, RouteHandler as RouteHandlerComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import FieldsStore from '../fields/fields-store';
import fieldsActions from '../fields/fields-actions';
import SettingsStore from './settings-store';
import settingsActions from './settings-actions';
import MenuGroupComponent from '../menu/menu-group';
import FieldsComponent from '../fields/fields';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);
const RouteHandler = createFactory(RouteHandlerComponent);
const Fields = createFactory(FieldsComponent);

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
      DOM.div({ className: 'settings full-screen' },
        DOM.header(null,
          Link({ to: 'menu' }, DOM.i({ className: 'fa fa-chevron-left' }), 'Back'),
          DOM.h1(null, 'Settings')
        ),
        DOM.main(null,
          DOM.ul({ className: 'menu' },
            DOM.li(null, this._settings()),
            DOM.li({ className: 'label' }, DOM.label(null, 'Fields')),
            Fields(),
            MenuGroup(null, DOM.li(null, Link({ to: 'new-field' },
              DOM.i({ className: 'fa fa-plus' }),
              ' Add field'
            )))
          )
        )
      ),
      RouteHandler()
    );
  },

  _settings () {
    const textFields = [
      'Max Upfront Cost',
      'Down Payment',
      'Closing Rate',
      'Interest Rate',
      'Insurance Rate',
      'PMI Rate'
    ];
    const textSettings = _.map(textFields, this._textSetting);
    const dropdownFields = [
      'Cost Field',
      'Taxes Field',
      'Visit Field'
    ]
    const dropdownSettings = _.map(dropdownFields, this._dropdownSetting);

    return textSettings.concat(dropdownSettings);
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
