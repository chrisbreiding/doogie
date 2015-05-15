import _ from 'lodash';
import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import { HOUSE_NAME_KEY, DEFAULT_FIELD_TYPE } from '../lib/constants';
import HouseInfoComponent from './house-info';
import LoaderComponent from '../loader/loader';
import TextareaComponent from '../lib/growing-textarea';

const Link = createFactory(LinkComponent);
const HouseInfo = createFactory(HouseInfoComponent);
const Loader = createFactory(LoaderComponent);
const Textarea = createFactory(TextareaComponent);

export default createClass({
  getDefaultProps () {
    return {
      house: { house: {} },
      fields: { fields: [] },
      settings: {}
    }
  },

  render () {
    if (!this.props.house.house) return Loader();

    return DOM.div({ className: 'house full-screen' },
      DOM.header(null,
        Link({ to: 'menu' }, DOM.i({ className: 'fa fa-chevron-left' }), 'Back'),
        DOM.h1()
      ),
      DOM.main(null,
        DOM.form({ onSubmit: this._onSubmit },
          DOM.input({
            ref: HOUSE_NAME_KEY,
            className: HOUSE_NAME_KEY,
            value: this.props.house.house[HOUSE_NAME_KEY] || '',
            onChange: _.partial(this._onChange, HOUSE_NAME_KEY)
          }),
          HouseInfo({
            house: this.props.house.house,
            settings: this.props.settings
          }),
          this._zillowLink(),
          this._fields(),
          DOM.button({
            className: 'remove',
            onClick: this._remove
          }, 'Remove house')
        )
      )
    );
  },

  _zillowLink () {
    const link = this.props.house.house[this.props.settings.zillowLinkField];
    if (!link) return null;

    return DOM.a({ href: link, target: '_blank', className: 'zillow-link' },
      'View on Zillow', DOM.i({ className: 'fa fa-external-link'})
    );
  },

  _fields () {
    if (!this.props.fields.fields.length) return Loader({ key: '__loading' });

    return _.map(this.props.fields.fields, (field) => {
      const textField = field.type === 'textarea' ? Textarea : DOM[DEFAULT_FIELD_TYPE];

      return DOM.fieldset({ key: field.id },
        DOM.label(null, field.label),
        textField({
          ref: field.id,
          value: this.props.house.house[field.id] || field.defaultNotes || '',
          onChange: _.partial(this._onChange, field.id)
        })
      );
    });
  },

  _onChange (key) {
    this.props.onChange(key, this.refs[key].getDOMNode().value);
  },

  _remove (e) {
    e.preventDefault();

    if (confirm('Remove this house?')) {
      this.props.onRemove();
    }
  },

  _onSubmit (e) {
    e.preventDefault();
  }
});
