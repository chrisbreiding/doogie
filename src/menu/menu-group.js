import { createFactory, createClass, DOM } from 'react';
import { isArray } from 'lodash';
import LoaderComponent from '../loader/loader';

const Loader = createFactory(LoaderComponent);

export default createClass({
  render () {
    const contents = this._showLoading() ? Loader({ el: 'li' }) : this.props.children;
    return DOM.li(null, DOM.ul(null, contents));
  },

  _showLoading () {
    if (!isArray(this.props.children)) return false;
    return !this.props.children.length;
  }
});
