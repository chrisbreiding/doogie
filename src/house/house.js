import { createClass, PropTypes, DOM } from 'react';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HouseStore from './house-store';
import actions from './house-actions';

export default createClass({
  mixins: [ReactStateMagicMixin],

  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    registerStore: HouseStore,
  },

  componentDidMount () {
    actions.listen(this._getId());
    this._focusName();
  },

  componentDidUpdate (__, prevState) {
    const id = this._getId();
    if (!prevState.house || prevState.house.id === id) return;

    if (prevState.house.id) actions.stopListening(prevState.house.id);
    actions.listen(id);
    this._focusName();
  },

  _getId () {
    return this.context.router.getCurrentParams().id;
  },

  _focusName () {
    if (this.refs.name) this.refs.name.getDOMNode().focus();
  },

  componentWillUnmount () {
    actions.stopListening(this.state.house.id);
  },

  render () {
    if (!this.state.house) return DOM.p(null, '...');

    return DOM.form(null,
      DOM.input({
        ref: 'name',
        value: this.state.house.name,
        onChange: this._onChange
      })
    );
  },

  _onChange () {
    actions.update(_.extend({}, this.state.house, {
      name: this.refs.name.getDOMNode().value
    }));
  }
});
