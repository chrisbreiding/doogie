import { createClass, DOM } from 'react';
import { isArray } from 'lodash';

export default createClass({
  render () {
    const contents = this._showLoading() ? DOM.li(null, '...') : this.props.children;
    return DOM.li(null, DOM.ul(null, contents));
  },

  _showLoading () {
    if (!isArray(this.props.children)) return false;
    return !this.props.children.length;
  }
});
