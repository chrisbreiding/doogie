require('./main.styl');

import { render, createFactory, PropTypes, createClass, DOM } from 'react';
import Router from 'react-router';
import RSVP from 'rsvp';

import AppComponent from './app/app';
import MenuComponent from './menu/menu';
import HouseComponent from './house/house';
import NewHouseComponent from './house/new-house';
import LoginComponent from './auth/login';
import LogoutComponent from './auth/logout';
import SettingsComponent from './settings/settings';

RSVP.on('error', (e) => {
  console.error('Error caught by RSVP:');
  console.error(e.message);
  console.error(e.stack);
});

const Route = createFactory(Router.Route);
const Redirect = createFactory(Router.Redirect);
const DefaultRoute = createFactory(Router.DefaultRoute);

const routes = Route({ handler: AppComponent, path: '/' },
  Route({ name: 'menu', handler: MenuComponent, path: '/' },
    Route({ name: 'settings', handler: SettingsComponent, path: 'settings' }),
    Route({ name: 'new-house', handler: NewHouseComponent, path: 'houses/new' }),
    Route({ name: 'house', handler: HouseComponent, path: 'houses/:id' })
  ),
  Route({ name: 'login', handler: LoginComponent, path: 'login' }),
  Route({ name: 'logout', handler: LogoutComponent, path: 'logout' })
);

Router.run(routes, (Handler)=> {
  render(createFactory(Handler)(), document.getElementById('app'));
});
