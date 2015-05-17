import { createClass, DOM } from 'react';
import { icon } from '../lib/util';

export default createClass({
  render () {
    return DOM[this.props.el || 'div']({ className: `loader ${this.props.size || 'large'}` },
      icon('spin fa-spinner')
    );
  }
});
