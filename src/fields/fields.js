import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent, RouteHandler as RouteHandlerComponent } from 'react-router';
import MenuGroupComponent from '../menu/menu-group';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import FieldsStore from './fields-store';
import actions from './fields-actions';
import LoaderComponent from '../loader/loader';
import FieldsComponent from '../fields/fields';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);
const RouteHandler = createFactory(RouteHandlerComponent);

export default createClass({
  mixins: [ReactStateMagicMixin],

  statics: {
    registerStore: FieldsStore
  },

  componentDidMount () {
    actions.listen();
  },

  componentWillUnmount () {
    actions.stopListening();
  },

  render () {
    const menuProps = {
      sortable: true,
      onSortingUpdate: actions.updateSorting.bind(actions)
    };

    const fields = this.state.fields;

    return DOM.div(null,
      DOM.div({ className: 'fields full-screen' },
        DOM.header(null,
          Link({ to: 'settings' }, DOM.i({ className: 'fa fa-chevron-left' }), 'Back'),
          DOM.h1(null, 'Fields')
        ),
        DOM.main(null,
          DOM.ul({ className: 'menu' },
            MenuGroup(menuProps, _.map(fields, (field) => {
              return DOM.li({ key: field.id, className: 'sortable-item', 'data-id': field.id },
                DOM.i({ className: 'fa fa-bars' }),
                Link({ to: 'field', params: { id: field.id }}, field.label)
              );
            })),
            MenuGroup(null, DOM.li(null, Link({ to: 'new-field' },
              DOM.i({ className: 'fa fa-plus' }), 'Add field'
            )))
          )
        )
      ),
      RouteHandler()
    );
  }

});
