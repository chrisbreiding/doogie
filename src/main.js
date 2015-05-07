require('./main.styl');

import { render, createFactory, PropTypes, createClass, DOM } from 'react';
import Router from 'react-router';
import RSVP from 'rsvp';

import AppComponent from './app/app';
import HousesComponent from './houses/houses';
import HouseComponent from './house/house';
import LoginComponent from './auth/login';
import LogoutComponent from './auth/logout';

RSVP.on('error', (e) => {
  console.error('Error caught by RSVP:');
  console.error(e.message);
  console.error(e.stack);
});

const Route = createFactory(Router.Route);
const Redirect = createFactory(Router.Redirect);
const DefaultRoute = createFactory(Router.DefaultRoute);

const routes = Route({ handler: AppComponent, path: '/' },
  Redirect({ from: '/', to: '/houses' }),
  Route({ name: 'houses', handler: HousesComponent, path: 'houses' },
    Route({ name: 'house', handler: HouseComponent, path: ':id' })
  ),
  Route({ name: 'login', handler: LoginComponent, path: 'login' }),
  Route({ name: 'logout', handler: LogoutComponent, path: 'logout' })
);

Router.run(routes, (Handler)=> {
  render(createFactory(Handler)(), document.getElementById('app'));
});
