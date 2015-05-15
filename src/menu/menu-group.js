import { createFactory, createClass, DOM } from 'react';
import { isArray } from 'lodash';
import LoaderComponent from '../loader/loader';
import SortableListComponent from '../sortable-list/sortable-list';

const Loader = createFactory(LoaderComponent);
const SortableList = createFactory(SortableListComponent);

export default createClass({
  getDefaultProps () {
    return {
      sortable: false,
      onSortingUpdate: () => {}
    };
  },

  render () {
    if (this._showLoading()) return Loader();

    const list = this.props.sortable ?

      SortableList({
        el: 'ul',
        onSortingUpdate: this.props.onSortingUpdate
      }, this.props.children) :

      DOM.ul(null, this.props.children);

    return DOM.li(this.props, list);
  },

  _showLoading () {
    if (!isArray(this.props.children)) return false;
    return !this.props.children.length;
  }
});
