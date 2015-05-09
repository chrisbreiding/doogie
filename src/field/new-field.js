import { createFactory, createClass, PropTypes, DOM } from 'react';
import { add } from './field-actions';
import LoaderComponent from '../loader/loader';

const Loader = createFactory(LoaderComponent);

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
    return DOM.div({ className: 'adding full-screen' }, Loader());
  }
});
