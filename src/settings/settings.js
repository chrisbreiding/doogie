import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import SettingsStore from './settings-store';
import { listen, stopListening } from './settings-actions';

const Link = createFactory(LinkComponent);

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
        Link({ to: 'menu' }, '< Back'),
        DOM.h1(null, 'Settings')
      ),
      DOM.main(null,
        DOM.h2(null, 'Fields'),
        DOM.ul(null, this._fields())
      )
    );
  },

  _fields () {
    if (this.state.fields.length) {
      return _.map(this.state.fields, (field) => {
        return DOM.li({ key: field.id }, field.label);
      });
    } else {
      return DOM.li(null, '...');
    }
  }
});
