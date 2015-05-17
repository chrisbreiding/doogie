import { createClass, createFactory, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import auth from '../auth/auth';
import HousesListComponent from '../houses/houses-list';

const Link = createFactory(LinkComponent);
const HousesList = createFactory(HousesListComponent);

export default createClass({
  render () {
    return DOM.div({ className: 'archived-houses full-screen' },
      DOM.header(null,
        Link({ to: 'menu' }, DOM.i({ className: 'fa fa-chevron-left' }), 'Back'),
        DOM.h1()
      ),
      DOM.main(null, DOM.ul(null, HousesList({ dataKey: 'archivedHouses' })))
    )
  }
});
