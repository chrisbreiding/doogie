import { createClass, PropTypes, DOM } from 'react';
import { add } from './house-actions';

export default createClass({
  contextTypes: {
    router: PropTypes.func
  },

  componentDidMount () {
    add((id) => {
      this.context.router.transitionTo(`/houses/${id}`);
    });
  },

  render () {
    return DOM.p(null, 'Adding new house...');
  }
});
