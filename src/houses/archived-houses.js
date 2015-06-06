import { createClass, createFactory, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import auth from '../auth/auth';
import HousesListComponent from '../houses/houses-list';
import { icon } from '../lib/util';

const Link = createFactory(LinkComponent);
const HousesList = createFactory(HousesListComponent);

export default createClass({
  render () {
    return DOM.div({ className: 'archived-houses' },
      DOM.header(null,
        Link({ to: 'menu' }, icon('chevron-left', 'Back')),
        DOM.h1(null, icon('archive', 'Archived Houses'))
      ),
      DOM.main(null, DOM.ul(null, HousesList({ dataKey: 'archivedHouses' })))
    )
  }
});
