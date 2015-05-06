import { createFactory, createClass, DOM } from 'react';
import { RouteHandler } from 'react-router';

export default createClass({
  render () {
    return createFactory(RouteHandler)();
  }
});
