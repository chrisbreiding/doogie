import { createClass, PropTypes, DOM } from 'react';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import FieldStore from './field-store';
import actions from './field-actions';

export default createClass({
  mixins: [ReactStateMagicMixin],

  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    registerStore: FieldStore,
  },

  componentDidMount () {
    actions.listen(this._getId());
    this._focusLabel();
  },

  componentDidUpdate (__, prevState) {
    const id = this._getId();
    if (!prevState.field || prevState.field.id === id) return;

    if (prevState.field.id) actions.stopListening(prevState.field.id);
    actions.listen(id);
    this._focusLabel();
  },

  _getId () {
    return this.context.router.getCurrentParams().id;
  },

  _focusLabel () {
    if (this.refs.label) this.refs.label.getDOMNode().focus();
  },

  componentWillUnmount () {
    actions.stopListening(this.state.field.id);
  },

  render () {
    if (!this.state.field) return DOM.p(null, '...');

    return DOM.form(null,
      DOM.label(null, 'Label'),
      DOM.input({
        ref: 'label',
        value: this.state.field.label,
        onChange: this._onChange
      })
    );
  },

  _onChange () {
    actions.update(_.extend({}, this.state.field, {
      label: this.refs.label.getDOMNode().value
    }));
  }
});
