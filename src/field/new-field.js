import { createFactory, createClass, PropTypes, DOM } from 'react';
import { Navigation } from 'react-router';
import { add } from './field-actions';
import LoaderComponent from '../loader/loader';

const Loader = createFactory(LoaderComponent);

export default createClass({
  mixins: [Navigation],

  componentDidMount () {
    add((id) => {
      this.transitionTo('field', { id });
    });
  },

  render () {
    return DOM.div({ className: 'adding full-screen' }, Loader());
  }
});
