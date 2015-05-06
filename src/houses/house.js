import { createClass, PropTypes, DOM } from 'react';

export default createClass({
  propTypes: {
    name: PropTypes.string
  },

  render () {
    return DOM.li(null, this.props.name);
  }
});
