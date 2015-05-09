import { createClass, DOM } from 'react';

export default createClass({
  render () {
    return DOM[this.props.el || 'div']({ className: `loader ${this.props.size || 'large'}` },
      DOM.i({ className: 'fa fa-spin fa-spinner' })
    );
  }
});
