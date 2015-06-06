import _ from 'lodash';
import { DEFAULT_FIELD_TYPE } from '../lib/constants';
import { createFactory, createClass, PropTypes, DOM } from 'react';
import { Link as LinkComponent, State, Navigation } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import FieldStore from './field-store';
import actions from './field-actions';
import LoaderComponent from '../loader/loader';
import TextareaComponent from '../lib/growing-textarea';
import { icon } from '../lib/util';

const Link = createFactory(LinkComponent);
const Loader = createFactory(LoaderComponent);
const Textarea = createFactory(TextareaComponent);

export default createClass({
  mixins: [ReactStateMagicMixin, State, Navigation],

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
    return this.getParams().id;
  },

  _focusLabel () {
    if (this.refs.label) this.refs.label.getDOMNode().focus();
  },

  componentWillUnmount () {
    actions.stopListening(this.state.field.id);
  },

  render () {
    if (!this.state.field) return Loader();

    const notesField = this.state.field.type === 'textarea' ? Textarea : DOM[DEFAULT_FIELD_TYPE];

    return DOM.div({ className: 'field' },
      DOM.header(null,
        Link({ to: 'fields' }, icon('chevron-left', 'Back')),
        DOM.h1()
      ),
      DOM.main(null,
        DOM.form({ onSubmit: this._onSubmit },
          DOM.fieldset(null,
            DOM.label(null, 'Type'),
            DOM.select({
              ref: 'type',
              value: this.state.field.type || DEFAULT_FIELD_TYPE,
              onChange: _.partial(this._onChange, 'type')
            }, _.map(this._types(), ({ label, value }) => {
              return DOM.option({ key: value, value: value }, label);
            }))
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
             notesField({
              ref: 'defaultNotes',
              key: this.state.field.id,
              value: this.state.field.defaultNotes || '',
              onChange: _.partial(this._onChange, 'defaultNotes')
            })
          ),
          DOM.button({ className: 'remove', onClick: this._remove }, 'Remove field')
        )
      )
    );
  },

  _types () {
    return [
      { label: 'Single', value: 'input' },
      { label: 'Multi-line', value: 'textarea' }
    ];
  },

  _onChange (key) {
    actions.update(_.extend({}, this.state.field, {
      [key]: this.refs[key].getDOMNode().value
    }));
  },

  _remove () {
    if (confirm('Remove this field?')) {
      actions.remove(this.state.field.id);
      this.transitionTo('fields');
    }
  },

  _onSubmit (e) {
    e.preventDefault();
  }
});
