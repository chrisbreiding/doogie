require('./main.styl');

import { render, createFactory } from 'react';
import Router from 'react-router';
import AppComponent from './app/app';

const Route = createFactory(Router.Route);
// const DefaultRoute = createFactory(Router.DefaultRoute);

const routes = Route({ handler: AppComponent, path: '/' });

Router.run(routes, (Handler)=> {
  render(createFactory(Handler)(), document.getElementById('app'));
});
