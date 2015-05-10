import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent, RouteHandler as RouteHandlerComponent } from 'react-router';
import MenuGroupComponent from '../menu/menu-group';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import SettingsStore from './settings-store';
import { listen, stopListening } from './settings-actions';
import LoaderComponent from '../loader/loader';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);
const Loader = createFactory(LoaderComponent);
const RouteHandler = createFactory(RouteHandlerComponent);

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
      DOM.div({ className: 'settings full-screen' },
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
        )
      ),
      RouteHandler()
    );
  },

  _fields () {
    const fields = this.state.fields;
    if (!fields.length) return Loader({ el: 'li' });

    return _.map(fields, (field) => {
      return DOM.li({ key: field.id },
        Link({ to: 'field', params: { id: field.id }}, field.label)
      );
    });
  }
});
