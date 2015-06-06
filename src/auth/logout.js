import { createClass, PropTypes, DOM } from 'react';
import { Navigation } from 'react-router';
import auth from './auth';

export default createClass({
  mixins: [Navigation],

  componentDidMount () {
    auth.logout();
    this.transitionTo('login');
  },

  render () {
    return DOM.div();
  }
});
