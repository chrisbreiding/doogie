import _ from 'lodash';
import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent, Navigation } from 'react-router';
import { HOUSE_NAME_KEY, DEFAULT_FIELD_TYPE } from '../lib/constants';
import HouseInfoComponent from './house-info';
import LoaderComponent from '../loader/loader';
import TextareaComponent from '../lib/growing-textarea';
import { icon, directionsUrl } from '../lib/util';

const Link = createFactory(LinkComponent);
const HouseInfo = createFactory(HouseInfoComponent);
const Loader = createFactory(LoaderComponent);
const Textarea = createFactory(TextareaComponent);

export default createClass({
  mixins: [Navigation],

  getDefaultProps () {
    return {
      house: { house: {} },
      fields: { fields: [] },
      settings: {}
    }
  },

  render () {
    if (!this.props.house.house) return Loader();

    return DOM.div({ className: 'house' },
      DOM.header(null,
        Link({ to: this._backRoute() }, icon('chevron-left', 'Back')),
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
          this._directionsLink(),
          this._fields(),
          DOM.button({
            className: 'archive',
            onClick: this._archive
          }, icon('archive', this.props.house.house.archived ? 'Unarchive' : 'Archive')),
          DOM.button({
            className: 'remove',
            onClick: this._remove
          }, icon('ban', 'Remove'))
        )
      )
    );
  },

  _zillowLink () {
    const link = this.props.house.house[this.props.settings.zillowLinkField];
    if (!link) return null;

    return DOM.a({ href: link, target: '_blank', className: 'link' },
      icon('home', 'View on Zillow')
    );
  },

  _directionsLink () {
    const address = this.props.house.house[HOUSE_NAME_KEY];

    return DOM.a({ href: directionsUrl(address), className: 'link' },
      icon('car', 'Driving Directions')
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

  _archive () {
    this.props.onChange('archived', !this.props.house.house.archived);
  },

  _remove (e) {
    e.preventDefault();

    if (confirm('Remove this house?')) {
      this.props.onRemove();
      this.transitionTo(this._backRoute());
    }
  },

  _backRoute () {
    return this.props.house.house.archived ? 'archived-houses' : 'menu';
  },

  _onSubmit (e) {
    e.preventDefault();
  }
});
