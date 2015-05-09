import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent, RouteHandler } from 'react-router';
import MenuGroupComponent from '../menu/menu-group';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import SettingsStore from './settings-store';
import { listen, stopListening } from './settings-actions';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  statics: {
    registerStore: SettingsStore
  },

  componentDidMount () {
    listen();
  },

  componentWillUnmount () {
    stopListening();
  },

  render () {
    return DOM.div(null,
      DOM.header(null,
        Link({ to: 'menu' }, DOM.i({ className: 'fa fa-chevron-left' }), ' Back'),
        DOM.h1(null, 'Settings')
      ),
      DOM.main(null,
        DOM.label(null, 'Fields'),
        DOM.ul({ className: 'menu' }, MenuGroup(null, this._fields())),
        MenuGroup(null, DOM.li(null, Link({ to: 'new-field' },
          DOM.i({ className: 'fa fa-plus' }),
          ' Add field'
        )))
      ),
      createFactory(RouteHandler)()
    );
  },

  _fields () {
    if (this.state.fields.length) {
      return _.map(this.state.fields, (field) => {
        return DOM.li({ key: field.id },
          Link({ to: 'field', params: { id: field.id }}, field.label)
        );
      });
    } else {
      return DOM.li(null, '...');
    }
  }
});
