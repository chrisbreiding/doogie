import { createClass, PropTypes, DOM } from 'react';
import auth from './auth';

export default createClass({
  contextTypes: {
    router: PropTypes.func
  },

  componentDidMount () {
    auth.logout();
    this.context.router.transitionTo('login');
  },

  render () {
    return DOM.div();
  }
});
