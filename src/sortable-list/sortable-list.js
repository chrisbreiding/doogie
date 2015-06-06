import _ from 'lodash';
import dragula from 'dragula';
import { createClass, DOM } from 'react';

function idsAndIndex (els, el) {
  const ids = _.pluck(els, 'dataset.id');
  const index = _.findIndex(ids, _.partial(_.isEqual, el.dataset.id));
  return { ids, index };
}

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
    this.drake = dragula([this.getDOMNode()], {
      moves: (el, container, handle) => {
        if (!this.props.handleClass) return true;

        let handleEl = handle;
        while (handleEl !== el) {
          if (this._hasHandleClass(handleEl)) return true;
          handleEl = handleEl.parentElement;
        }

        return false;
      }
    })
      .on('drag', (el, container) => {
        originalIndex = idsAndIndex(container.children, el).index;
      })
      .on('drop', (el, container) => {
        const { ids, index } = idsAndIndex(container.children, el);
        if (originalIndex === container.children.length - 1) {
          container.appendChild(el);
        } else if (index < originalIndex) {
          container.insertBefore(el, container.children[originalIndex + 1]);
        } else {
          container.insertBefore(el, container.children[originalIndex]);
        }
        this.props.onSortingUpdate(ids);
      });
  },

  _hasHandleClass (el) {
    return el.className.indexOf(this.props.handleClass) >= 0;
  },

  _tearDownSorting () {
    if (this.drake) this.drake.destroy();
  },

  render () {
    return DOM[this.props.el || 'div'](null, this.props.children);
  }
})
