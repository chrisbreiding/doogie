require('./main.styl');

import fastClick from 'fastclick';
import { render, createFactory } from 'react';
import { run } from 'react-router';
import RSVP from 'rsvp';
import routes from './routes';

fastClick.attach(document.body);

RSVP.on('error', (e) => {
  console.error('Error caught by RSVP:');
  console.error(e.message);
  console.error(e.stack);
});

run(routes, (Handler)=> {
  render(createFactory(Handler)(), document.getElementById('app'));
});
