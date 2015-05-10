import _ from 'lodash';
import { createFactory, createClass, PropTypes, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import FieldStore from './field-store';
import actions from './field-actions';
import LoaderComponent from '../loader/loader';
import TextareaComponent from '../lib/growing-textarea';

const Link = createFactory(LinkComponent);
const Loader = createFactory(LoaderComponent);
const Textarea = createFactory(TextareaComponent);

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
    if (!this.state.field) return Loader();

    return DOM.form({ className: 'fields full-screen' },
      DOM.header(null,
        Link({ to: 'settings' }, DOM.i({ className: 'fa fa-chevron-left' }), ' Back'),
        DOM.h1()
      ),
      DOM.fieldset(null,
        DOM.label(null, 'Label'),
        DOM.input({
          ref: 'label',
          value: this.state.field.label || '',
          onChange: _.partial(this._onChange, 'label')
        })
      ),
      DOM.fieldset(null,
        DOM.label(null, 'Default notes'),
        Textarea({
          ref: 'defaultNotes',
          value: this.state.field.defaultNotes || '',
          onChange: _.partial(this._onChange, 'defaultNotes')
        })
      )
    );
  },

  _onChange (key) {
    actions.update(_.extend({}, this.state.field, {
      [key]: this.refs[key].getDOMNode().value
    }));
  }
});
