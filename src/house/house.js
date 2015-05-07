import { createClass, PropTypes, DOM } from 'react';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HouseStore from './house-store';
import { listen, stopListening } from './house-actions';

export default createClass({
  mixins: [ReactStateMagicMixin],

  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    registerStore: HouseStore,
  },

  componentDidMount () {
    const id = this.context.router.getCurrentParams().id;
    listen(id);
  },

  componentDidUpdate (__, prevState) {
    const id = this.context.router.getCurrentParams().id;
    if (!prevState.house || prevState.house.id === id) return;

    stopListening(prevState.house.id);
    listen(id);
  },

  componentWillUnmount () {
    stopListening(this.state.house.id);
  },

  render () {
    if (!this.state.house) return DOM.p(null, '...');
    return DOM.h1(null, this.state.house.name);
  }
});
