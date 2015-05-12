import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import MenuGroupComponent from '../menu/menu-group';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import FieldsStore from './fields-store';
import actions from './fields-actions';
import LoaderComponent from '../loader/loader';
import FieldsComponent from '../fields/fields';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);

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

    return MenuGroup(menuProps, _.map(fields, (field) => {
      return DOM.li({ key: field.id, className: 'sortable-item', 'data-id': field.id },
        DOM.i({ className: 'fa fa-bars' }),
        Link({ to: 'field', params: { id: field.id }}, field.label)
      );
    }));
  }

});
