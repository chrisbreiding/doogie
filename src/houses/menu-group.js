import { createClass, DOM } from 'react';

export default createClass({
  render () {
    return DOM.li(null, DOM.ul(null, this.props.children));
  }
});
