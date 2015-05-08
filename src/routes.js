import { createFactory } from 'react';
import Router from 'react-router';

import AppComponent from './app/app';
import MenuComponent from './menu/menu';
import HouseComponent from './house/house';
import NewHouseComponent from './house/new-house';
import LoginComponent from './auth/login';
import LogoutComponent from './auth/logout';
import SettingsComponent from './settings/settings';
import FieldComponent from './field/field';
import NewFieldComponent from './field/new-field';

const Route = createFactory(Router.Route);
const Redirect = createFactory(Router.Redirect);
const DefaultRoute = createFactory(Router.DefaultRoute);

export default Route({ handler: AppComponent, path: '/' },
  Route({ name: 'menu', handler: MenuComponent, path: '/' },
    Route({ name: 'settings', handler: SettingsComponent, path: 'settings' },
      Route({ name: 'new-field', handler: NewFieldComponent, path: 'fields/new' }),
      Route({ name: 'field', handler: FieldComponent, path: 'fields/:id' })
    ),
    Route({ name: 'new-house', handler: NewHouseComponent, path: 'houses/new' }),
    Route({ name: 'house', handler: HouseComponent, path: 'houses/:id' })
  ),
  Route({ name: 'login', handler: LoginComponent, path: 'login' }),
  Route({ name: 'logout', handler: LogoutComponent, path: 'logout' })
);
