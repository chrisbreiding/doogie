import { createClass, PropTypes, DOM } from 'react';
import { add } from './field-actions';

export default createClass({
  contextTypes: {
    router: PropTypes.func
  },

  componentDidMount () {
    add((id) => {
      this.context.router.transitionTo('field', { id });
    });
  },

  render () {
    return DOM.p(null, 'Adding new field...');
  }
});
