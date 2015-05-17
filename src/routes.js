import { createFactory, createClass } from 'react';
import Router from 'react-router';

import AppComponent from './app/app';
import MenuComponent from './menu/menu';
import HouseControllerComponent from './house/house-controller';
import HousesComponent from './houses/houses';
import ArchivedHousesComponent from './houses/archived-houses';
import NewHouseComponent from './house/new-house';
import LoginComponent from './auth/login';
import LogoutComponent from './auth/logout';
import SettingsComponent from './settings/settings';
import FieldsComponent from './fields/fields';
import FieldComponent from './field/field';
import NewFieldComponent from './field/new-field';
import MapComponent from './map/map';

const Route = createFactory(Router.Route);
const RouteHandler = createFactory(Router.RouteHandler);

const RootComponent = createClass({ render () { return RouteHandler(); } });

export default Route({ handler: RootComponent, path: '/' },
  Route({ name: 'menu', handler: AppComponent, path: '/' },
    Route({ name: 'settings', handler: SettingsComponent },
      Route({ name: 'fields', handler: FieldsComponent },
        Route({ name: 'new-field', handler: NewFieldComponent, path: 'new' }),
        Route({ name: 'field', handler: FieldComponent, path: ':id' })
      )
    ),
    Route({ name: 'houses', handler: HousesComponent }),
    Route({ name: 'archived-houses', handler: ArchivedHousesComponent, path: 'houses/archived' }),
    Route({ name: 'new-house', handler: NewHouseComponent, path: 'houses/new' }),
    Route({ name: 'house', handler: HouseControllerComponent, path: 'houses/:id' }),
    Route({ name: 'map', handler: MapComponent })
  ),
  Route({ name: 'login', handler: LoginComponent, path: 'login' }),
  Route({ name: 'logout', handler: LogoutComponent, path: 'logout' })
);
