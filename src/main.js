require('./main.styl');

import fastClick from 'fastclick';
import { render, createFactory } from 'react';
import { create as createRouter } from 'react-router';
import RSVP from 'rsvp';
import routes from './routes';

fastClick.attach(document.body);

RSVP.on('error', (e) => {
  console.error('Error caught by RSVP:');
  console.error(e.message);
  console.error(e.stack);
});

const router = createRouter({ routes: routes });
const savedRoute = localStorage.savedRoute;

router.run((Handler, state) => {
  localStorage.savedRoute = state.path;
  render(createFactory(Handler)(), document.getElementById('app'));
});

if (savedRoute) router.transitionTo(savedRoute);
