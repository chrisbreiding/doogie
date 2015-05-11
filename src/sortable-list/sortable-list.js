import _ from 'lodash';
import dragula from 'dragula';
import { createClass, DOM } from 'react';

export default createClass({

  componentDidMount () {
    this._setupSorting();
  },

  componentWillUnmount () {
    this._tearDownSorting();
  },

  _setupSorting () {
    this._tearDownSorting();

    let originalIndex;
    this.drake = dragula([this.getDOMNode()])
      .on('drag', (el, container) => {
        originalIndex = _.findIndex(container.children, el);
      })
      .on('drop', (el, container) => {
        const ids = _.map(container.children, (el) => el.dataset.id);
        const newIndex = _.findIndex(container.children, el);
        if (originalIndex === container.children.length - 1) {
          container.appendChild(el);
        } else if (newIndex < originalIndex) {
          container.insertBefore(el, container.children[originalIndex + 1]);
        } else {
          container.insertBefore(el, container.children[originalIndex]);
        }
        this.props.onSortingUpdate(ids);
      });
  },

  _tearDownSorting () {
    if (this.drake) this.drake.destroy();
  },

  render () {
    return DOM[this.props.el || 'div'](null, this.props.children);
  }
})
