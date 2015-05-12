import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent, RouteHandler as RouteHandlerComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import SettingsStore from './settings-store';
import actions from './settings-actions';
import MenuGroupComponent from '../menu/menu-group';
import FieldsComponent from '../fields/fields';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);
const RouteHandler = createFactory(RouteHandlerComponent);
const Fields = createFactory(FieldsComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  statics: {
    registerStore: SettingsStore
  },

  componentDidMount () {
    actions.listen();
  },

  componentWillUnmount () {
    actions.stopListening();
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
    const settings = [
      { label: 'Down Payment',   key: 'downPayment' },
      { label: 'Interest Rate',  key: 'interestRate' },
      { label: 'Insurance Rate', key: 'insuranceRate' }
    ];

    return _.map(settings, (setting) => {
      return DOM.fieldset({ key: setting.key },
        DOM.label(null, setting.label),
        DOM.input({
          ref: setting.key,
          value: this.state[setting.key],
          onChange: _.partial(this._onSettingChange, setting.key)
        })
      )
    });
  },

  _onSettingChange (key) {
    actions.updateSetting(key, this.refs[key].getDOMNode().value);
  }
});
